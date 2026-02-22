import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';

import type { ApplicationListItem } from '@/api/application/api.model';

const applicationTypeVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  NORMAL: 'secondary',
  MEISTER: 'default',
  etc: 'outline',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function getColumns(
  onViewDetail: (item: ApplicationListItem) => void
): ColumnDef<ApplicationListItem>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="전체 선택"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="행 선택"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: '이메일',
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'contact',
      header: '연락처',
      cell: ({ row }) => <div>{row.getValue('contact')}</div>,
    },
    {
      accessorKey: 'department',
      header: '학과',
      cell: ({ row }) => <div>{row.getValue('department')}</div>,
    },
    {
      accessorKey: 'grade',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          학년
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue('grade')}</div>,
    },
    {
      accessorKey: 'applicationType',
      header: '지원 유형',
      cell: ({ row }) => {
        const type = row.getValue('applicationType') as string;
        return <Badge variant={applicationTypeVariant[type] ?? 'secondary'}>{type}</Badge>;
      },
    },
    {
      accessorKey: 'isPass',
      header: '합격',
      cell: ({ row }) => {
        const isPass = row.getValue('isPass') as boolean;
        return (
          <Badge variant={isPass ? 'success' : 'destructive'}>{isPass ? '합격' : '불합격'}</Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          지원일
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">{formatDate(row.getValue('createdAt'))}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <span className="sr-only">메뉴 열기</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => onViewDetail(item)}>상세 보기</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onViewDetail(item)}>합격 처리</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onViewDetail(item)}>불합격 처리</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
