'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  Download,
  Filter,
  BarChart3,
  PieChart,
  UserCheck
} from 'lucide-react';
import { OverviewRevenueChart, AnalyticsTrendChart } from '@/components/admin/report';
import AdminGuard from '@/components/admin/AdminGuard';
import CompletedOrderCard from '@/components/admin/CompletedOrderCard';

const supabase = createClient();

type CompletedOrder = {
  id: number;
  customer_name: string;
  total_price: number;
  payment_proof_url: string | null;
  created_at: string;
  order_items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    item_price: number;
    selected_options: Record<string, string> | null;
    group_tag: string | null;
  }>;
};

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  completedOrders: number;
  completedOrdersList: CompletedOrder[];
  popularItems: Array<{
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
    completedOrders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  paymentMethods: Array<{
    payment_method: string;
    count: number;
    revenue: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    orders: number;
  }>;
  salesByOwner: Array<{
    owner: string;
    total_revenue: number;
    total_items_sold: number;
    products: Array<{
      product_name: string;
      quantity_sold: number;
      revenue: number;
    }>;
  }>;
};

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'products' | 'analytics' | 'owner' | 'orders'>('overview');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return '2020-01-01T00:00:00Z';
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter();
      
      // Fetch orders with items and product owner information
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          customer_name,
          total_price,
          status,
          payment_method,
          payment_proof_url,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            item_price,
            selected_options,
            group_tag,
            product_id,
            products!order_items_product_id_fkey (
              owner,
              name
            )
          )
        `)
        .gte('created_at', dateFilter)
        .order('created_at', { ascending: false });

      if (!orders) {
        setReportData(null);
        return;
      }

      // Calculate basic metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
      const totalOrders = orders.length;
      const completedOrders = orders.filter(o => o.status === 'Completed').length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Popular items
      const itemMap = new Map<string, { quantity: number; revenue: number }>();
      orders.forEach(order => {
        order.order_items?.forEach(item => {
          const current = itemMap.get(item.product_name) || { quantity: 0, revenue: 0 };
          itemMap.set(item.product_name, {
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + (item.item_price * item.quantity)
          });
        });
      });

      const popularItems = Array.from(itemMap.entries())
        .map(([product_name, data]) => ({
          product_name,
          total_quantity: data.quantity,
          total_revenue: data.revenue
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 10);

      // Revenue by date (last 30 days) with completed orders
      const dateMap = new Map<string, { revenue: number; orders: number; completedOrders: number }>();
      orders.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        const current = dateMap.get(date) || { revenue: 0, orders: 0, completedOrders: 0 };
        dateMap.set(date, {
          revenue: current.revenue + order.total_price,
          orders: current.orders + 1,
          completedOrders: current.completedOrders + (order.status === 'Completed' ? 1 : 0)
        });
      });

      const revenueByDate = Array.from(dateMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

      // Orders by status
      const statusMap = new Map<string, number>();
      orders.forEach(order => {
        statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
      });
      const ordersByStatus = Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }));

      // Payment methods
      const paymentMap = new Map<string, { count: number; revenue: number }>();
      orders.forEach(order => {
        const current = paymentMap.get(order.payment_method) || { count: 0, revenue: 0 };
        paymentMap.set(order.payment_method, {
          count: current.count + 1,
          revenue: current.revenue + order.total_price
        });
      });
      const paymentMethods = Array.from(paymentMap.entries())
        .map(([payment_method, data]) => ({ payment_method, ...data }));

      // Hourly distribution
      const hourMap = new Map<number, number>();
      orders.forEach(order => {
        const hour = new Date(order.created_at).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      });
      const hourlyDistribution = Array.from(hourMap.entries())
        .map(([hour, orders]) => ({ hour, orders }))
        .sort((a, b) => a.hour - b.hour);

      // Calculate sales by owner
      const ownerMap = new Map<string, { revenue: number; itemsSold: number; productMap: Map<string, { quantity: number; revenue: number }> }>();

      orders.forEach(order => {
        order.order_items?.forEach(item => {
          // Default to 'Unassigned' if owner is null or product data is missing
          const productData = Array.isArray(item.products) ? item.products[0] : item.products;
          const owner = productData?.owner || 'Unassigned';
          const itemRevenue = item.item_price * item.quantity;

          if (!ownerMap.has(owner)) {
            ownerMap.set(owner, { revenue: 0, itemsSold: 0, productMap: new Map() });
          }

          const ownerInfo = ownerMap.get(owner)!;
          ownerInfo.revenue += itemRevenue;
          ownerInfo.itemsSold += item.quantity;
          
          const productSalesData = ownerInfo.productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
          productSalesData.quantity += item.quantity;
          productSalesData.revenue += itemRevenue;
          ownerInfo.productMap.set(item.product_name, productSalesData);
        });
      });

      const salesByOwner = Array.from(ownerMap.entries()).map(([owner, data]) => ({
        owner,
        total_revenue: data.revenue,
        total_items_sold: data.itemsSold,
        products: Array.from(data.productMap.entries()).map(([product_name, pData]) => ({
          product_name,
          quantity_sold: pData.quantity,
          revenue: pData.revenue
        })).sort((a, b) => b.revenue - a.revenue)
      })).sort((a, b) => b.total_revenue - a.total_revenue);

      // Extract completed orders for the new Orders tab
      const completedOrdersList: CompletedOrder[] = orders
        .filter(order => order.status === 'Completed')
        .map(order => ({
          id: order.id,
          customer_name: order.customer_name,
          total_price: order.total_price,
          payment_proof_url: order.payment_proof_url,
          created_at: order.created_at,
          order_items: order.order_items || []
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setReportData({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        completedOrders,
        completedOrdersList,
        popularItems,
        revenueByDate,
        ordersByStatus,
        paymentMethods,
        hourlyDistribution,
        salesByOwner
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!reportData) return;
    
    const dataToExport = {
      generatedAt: new Date().toISOString(),
      dateRange,
      summary: {
        totalRevenue: reportData.totalRevenue,
        totalOrders: reportData.totalOrders,
        avgOrderValue: reportData.avgOrderValue,
        completedOrders: reportData.completedOrders
      },
      popularItems: reportData.popularItems,
      revenueByDate: reportData.revenueByDate,
      ordersByStatus: reportData.ordersByStatus,
      paymentMethods: reportData.paymentMethods,
      hourlyDistribution: reportData.hourlyDistribution,
      salesByOwner: reportData.salesByOwner
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kusina-amadeo-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 p-4 border-b bg-surface shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-primary">Reports & Analytics</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="px-3 py-2 border border-border rounded-lg bg-surface text-foreground"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            {/* Export Button */}
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        
        {/* View Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'products', label: 'Products', icon: ShoppingBag },
            { key: 'owner', label: 'Owner Sales', icon: UserCheck },
            { key: 'analytics', label: 'Analytics', icon: PieChart },
            { key: 'orders', label: 'Orders', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedView(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === key 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-muted hover:bg-surface'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        {!reportData ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No data available for the selected period.</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {selectedView === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-success">₱{reportData.totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="text-success" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-primary">{reportData.totalOrders}</p>
                      </div>
                      <ShoppingBag className="text-primary" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted text-sm">Average Order Value</p>
                        <p className="text-2xl font-bold text-info">₱{reportData.avgOrderValue.toFixed(0)}</p>
                      </div>
                      <TrendingUp className="text-info" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted text-sm">Completed Orders</p>
                        <p className="text-2xl font-bold text-accent">{reportData.completedOrders}</p>
                      </div>
                      <Calendar className="text-accent" size={24} />
                    </div>
                  </div>
                </div>

                {/* Enhanced Revenue Chart */}
                <OverviewRevenueChart data={reportData.revenueByDate} />
              </div>
            )}

            {/* Products Tab */}
            {selectedView === 'products' && (
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 border border-border">
                  <h3 className="text-xl font-bold mb-4">Top 10 Popular Items</h3>
                  <div className="space-y-3">
                    {reportData.popularItems.map((item, index) => (
                      <div key={item.product_name} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.product_name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.total_quantity} sold</div>
                          <div className="text-success text-sm">₱{item.total_revenue.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Owner Sales Tab */}
            {selectedView === 'owner' && (
              <div className="space-y-6">
                {reportData.salesByOwner.map((ownerData) => (
                  <div key={ownerData.owner} className="bg-surface rounded-xl p-6 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{ownerData.owner}'s Sales</h3>
                        <p className="text-muted">{ownerData.total_items_sold} items sold</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted text-sm">Total Revenue</p>
                        <p className="text-3xl font-extrabold text-success">
                          ₱{ownerData.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold mb-2">Product Breakdown:</h4>
                      <div className="space-y-2">
                        {ownerData.products.map(product => (
                          <div key={product.product_name} className="flex justify-between items-center p-2 bg-background rounded-md">
                            <div>
                              <span className="font-medium">{product.product_name}</span>
                              <span className="text-muted text-sm ml-2">({product.quantity_sold} sold)</span>
                            </div>
                            <span className="font-semibold text-success/80">
                              ₱{product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Tab */}
            {selectedView === 'analytics' && (
              <div className="space-y-6">
                {/* Multi-Metric Trend Analysis */}
                <AnalyticsTrendChart data={reportData.revenueByDate} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Status Distribution */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h3 className="text-xl font-bold mb-4">Orders by Status</h3>
                    <div className="space-y-3">
                      {reportData.ordersByStatus.map((status) => (
                        <div key={status.status} className="flex items-center justify-between">
                          <span className="font-medium">{status.status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-background rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ 
                                  width: `${(status.count / reportData.totalOrders) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted">{status.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      {reportData.paymentMethods.map((method) => (
                        <div key={method.payment_method} className="flex items-center justify-between">
                          <span className="font-medium">{method.payment_method}</span>
                          <div className="text-right">
                            <div className="font-bold">{method.count} orders</div>
                            <div className="text-success text-sm">₱{method.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hourly Distribution */}
                <div className="bg-surface rounded-xl p-6 border border-border">
                  <h3 className="text-xl font-bold mb-4">Orders by Hour of Day</h3>
                  <div className="h-48 flex items-end gap-1 overflow-x-auto">
                    {Array.from({ length: 24 }, (_, i) => {
                      const hourData = reportData.hourlyDistribution.find(h => h.hour === i);
                      const orders = hourData?.orders || 0;
                      const maxOrders = Math.max(...reportData.hourlyDistribution.map(h => h.orders));
                      
                      return (
                        <div key={i} className="flex flex-col items-center min-w-[30px]">
                          <div 
                            className="bg-info w-6 rounded-t min-h-[2px]"
                            style={{ 
                              height: `${Math.max(2, (orders / Math.max(1, maxOrders)) * 150)}px` 
                            }}
                          />
                          <span className="text-xs text-muted mt-1">
                            {i.toString().padStart(2, '0')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {selectedView === 'orders' && (
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 border border-border">
                  <h3 className="text-xl font-bold mb-4">Completed Orders ({reportData.completedOrdersList.length})</h3>
                  {reportData.completedOrdersList.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted text-lg">No completed orders in the selected period.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {reportData.completedOrdersList.map((order) => (
                        <CompletedOrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
    </AdminGuard>
  );
}
