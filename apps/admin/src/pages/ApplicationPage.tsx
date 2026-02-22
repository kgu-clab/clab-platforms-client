import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { ApplicationDetailModal } from '@/components/application/ApplicationDetailModal';
import { DataTable } from '@/components/application/ApplicationTable';
import { getColumns } from '@/components/application/ApplicationTableColumn';
import { Header } from '@/components/common/Header';

import type { ApplicationListItem, PaginationMeta } from '@/api/application/api.model';
import { applicationQueryKeys, getApplicationConditions } from '@/api/application/api.query';

const RECRUITMENT_ID = 14;
const PAGE_SIZE = 10;

export function ApplicationPage() {
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApplicationListItem | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: applicationQueryKeys.list(RECRUITMENT_ID, { page, size: PAGE_SIZE }),
    queryFn: () =>
      getApplicationConditions({
        recruitmentId: RECRUITMENT_ID,
        page,
        size: PAGE_SIZE,
      }),
  });

  const items: ApplicationListItem[] = data?.items ?? [];
  const pagination: PaginationMeta = data
    ? {
        currentPage: data.currentPage,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        take: data.take,
      }
    : {
        currentPage: 1,
        hasPrevious: false,
        hasNext: false,
        totalPages: 1,
        totalItems: 0,
        take: PAGE_SIZE,
      };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleViewDetail = (item: ApplicationListItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const columns = getColumns(handleViewDetail);

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 md:hidden">
        <p className="text-muted-foreground text-center text-sm">
          이 화면은 데스크톱에 최적화되어 있습니다. 브라우저를 넓히거나 큰 화면에서 이용해 주세요.
        </p>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">지원 목록</h2>
            <p className="text-muted-foreground">
              동아리 지원자 목록입니다. 검색·정렬·컬럼 표시를 변경할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Header />
          </div>
        </div>
        {isPending && <p className="text-muted-foreground text-sm">지원 목록을 불러오는 중...</p>}
        {isError && (
          <p className="text-destructive text-sm">
            {error instanceof Error ? error.message : '지원 목록을 불러오지 못했습니다.'}
          </p>
        )}
        <DataTable
          data={items}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          filterColumnKey="name"
        />
        <ApplicationDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          item={selectedItem}
        />
      </div>
    </>
  );
}
