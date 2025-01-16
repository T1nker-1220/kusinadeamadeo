'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Product, ProductVariant } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { toast } from 'sonner';

// Omit Date fields from Product type
type ProductWithoutDates = Omit<Product, 'createdAt' | 'updatedAt'>;

// Create interface with string dates
interface ProductWithRelations extends ProductWithoutDates {
  category: { name: string };
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export function ProductsDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);

  const columns: ColumnDef<ProductWithRelations>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'imageUrl',
      header: 'Image',
      cell: ({ row }) => (
        <div className="relative h-10 w-10">
          <Image
            src={row.getValue('imageUrl') || '/images/placeholder.jpg'}
            alt={row.getValue('name')}
            className="rounded-md object-cover"
            fill
            sizes="40px"
          />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'category.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
    },
    {
      accessorKey: 'basePrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Base Price" />
      ),
      cell: ({ row }) => formatCurrency(row.getValue('basePrice')),
    },
    {
      accessorKey: 'isAvailable',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isAvailable = row.getValue('isAvailable');
        return (
          <Badge variant={isAvailable ? 'default' : 'secondary'}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value === 'true' ? row.getValue(id) : !row.getValue(id);
      },
    },
    {
      accessorKey: 'variants',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Variants" />
      ),
      cell: ({ row }) => {
        const variants: ProductVariant[] = row.getValue('variants');
        return variants.length > 0 ? (
          <Badge variant="outline">{variants.length} variants</Badge>
        ) : null;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <Link href={`/admin/products/${row.original.id}`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={async () => {
                try {
                  const response = await fetch(`/api/products/${row.original.id}`, {
                    method: 'DELETE',
                  });

                  if (!response.ok) {
                    throw new Error('Failed to delete product');
                  }

                  toast.success('Product deleted successfully');
                  refetch();
                } catch (error) {
                  toast.error('Failed to delete product');
                }
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', sorting, columnFilters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();

        if (sorting.length > 0) {
          const sortField = sorting[0].id === 'category.name' ? 'category' : sorting[0].id;
          params.set('sortBy', sortField);
          params.set('sortOrder', sorting[0].desc ? 'desc' : 'asc');
        }

        columnFilters.forEach((filter) => {
          if (filter.id === 'category.name') {
            params.set('categoryId', filter.value as string);
          } else if (filter.id === 'isAvailable') {
            params.set('isAvailable', String(filter.value));
          } else if (filter.id === 'name') {
            params.set('search', filter.value as string);
          }
        });

        // Add pagination parameters
        params.set('page', String(pageIndex + 1));
        params.set('limit', '50'); // Increased limit to show more products

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (!result.products || !Array.isArray(result.products)) {
          throw new Error('Invalid response format');
        }

        return result;
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
        throw error;
      }
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes (previously cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: 50,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize: 50 });
        setPageIndex(newState.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Reset pagination when filters or sorting change
  React.useEffect(() => {
    setPageIndex(0);
  }, [columnFilters, sorting]);

  // Show loading state
  if (isLoading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} searchKey="name" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
