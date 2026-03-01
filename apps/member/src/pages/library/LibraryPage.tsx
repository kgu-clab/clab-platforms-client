import { Header, PlusButton, Section, Title } from "@clab/design-system";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useDebounce } from "@/model/common/useDebounce";
import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import { BOOK_STATUS, type BookStatus } from "@/types/library";

import {
  LibrarySearchBar,
  LibraryFilter,
  LibraryBookList,
} from "@/components/library";
import { BottomNavbar } from "@/components/menu";

import { libraryQueries } from "@/api/library/api.query";
import { ROUTE } from "@/constants";

export default function LibraryPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [borrowStatus, setBorrowStatus] = useState<BookStatus>(BOOK_STATUS.ALL);

  const debouncedTitle = useDebounce(title, 500);

  const request = {
    title: debouncedTitle.trim() || undefined,
  };

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(libraryQueries.getBooksInfiniteQuery(request));

  const { scrollRef, bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const books = useMemo(
    () => data?.pages.flatMap((page) => page.data.items) ?? [],
    [data],
  );

  const handleAddBook = () => {
    navigate(ROUTE.LIBRARY_CREATE);
  };

  return (
    <>
      <Header
        left={<Title>도서관</Title>}
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <Section
        ref={scrollRef}
        className="pt-header-height pb-bottom-padding h-full overflow-y-auto"
      >
        <LibrarySearchBar value={title} onChange={setTitle} />
        <LibraryFilter
          activeFilter={borrowStatus}
          onActiveFilterChange={setBorrowStatus}
        />
        <LibraryBookList books={books} bottomSentinelRef={bottomSentinelRef} />
      </Section>

      <PlusButton onClick={handleAddBook} />
      <BottomNavbar />
    </>
  );
}
