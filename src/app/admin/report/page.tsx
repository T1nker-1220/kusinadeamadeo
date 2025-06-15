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
  PieChart
} from 'lucide-react';

const supabase = createClient();

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  completedOrders: number;
  popularItems: Array<{
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
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
};

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function ReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'products' | 'analytics'>('overview');

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchReportData();
  }, [isAuthenticated, dateRange]);

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
      
      // Fetch orders with items
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          status,
          payment_method,
          created_at,
          order_items (
            product_name,
            quantity,
            item_price
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

      // Revenue by date (last 30 days)
      const dateMap = new Map<string, { revenue: number; orders: number }>();
      orders.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        const current = dateMap.get(date) || { revenue: 0, orders: 0 };
        dateMap.set(date, {
          revenue: current.revenue + order.total_price,
          orders: current.orders + 1
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

      setReportData({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        completedOrders,
        popularItems,
        revenueByDate,
        ordersByStatus,
        paymentMethods,
        hourlyDistribution
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
      hourlyDistribution: reportData.hourlyDistribution
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

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
        <div className="flex gap-2 mt-4">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'products', label: 'Products', icon: ShoppingBag },
            { key: 'analytics', label: 'Analytics', icon: PieChart }
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

                {/* Revenue Chart */}
                <div className="bg-surface rounded-xl p-6 border border-border">
                  <h3 className="text-xl font-bold mb-4">Daily Revenue Trend</h3>
                  <div className="h-64 flex items-end gap-2 overflow-x-auto">
                    {reportData.revenueByDate.map((day, index) => (
                      <div key={day.date} className="flex flex-col items-center min-w-[60px]">
                        <div 
                          className="bg-primary w-8 rounded-t min-h-[4px]"
                          style={{ 
                            height: `${Math.max(4, (day.revenue / Math.max(...reportData.revenueByDate.map(d => d.revenue))) * 200)}px` 
                          }}
                        />
                        <span className="text-xs text-muted mt-2 rotate-45 origin-left">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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

            {/* Analytics Tab */}
            {selectedView === 'analytics' && (
              <div className="space-y-6">
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
          </>
        )}
      </main>
    </div>
  );
}
