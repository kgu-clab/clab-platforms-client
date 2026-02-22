import { useState } from 'react';

import { ApplicationDetailModal } from '@/components/application/ApplicationDetailModal';
import { DataTable } from '@/components/application/ApplicationTable';
import { getColumns } from '@/components/application/ApplicationTableColumn';
import { Header } from '@/components/common/Header';

import {
  applicationListResponseSchema,
  type ApplicationListItem,
  type PaginationMeta,
} from '@/api/application/api.model';
import mockResponse from '@/mock/application.json';

function getApplications(): {
  items: ApplicationListItem[];
  pagination: PaginationMeta;
} {
  const parsed = applicationListResponseSchema.parse(mockResponse);
  return {
    items: parsed.data.items,
    pagination: {
      currentPage: parsed.data.currentPage,
      hasPrevious: parsed.data.hasPrevious,
      hasNext: parsed.data.hasNext,
      totalPages: parsed.data.totalPages,
      totalItems: parsed.data.totalItems,
      take: parsed.data.take,
    },
  };
}

export function ApplicationPage() {
  const { items, pagination } = getApplications();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApplicationListItem | null>(null);

  const handlePageChange = (page: number) => {
    // TODO: API 호출로 페이지 변경 (예: fetchApplications({ page }))
    console.log(page);
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
