import type { RefObject } from "react";

import type { Book } from "@/api/library/api.type";

import LibraryBookItem from "./LibraryBookItem";

type LibraryBookListProps = {
  books: Book[];
  bottomSentinelRef?: RefObject<HTMLDivElement | null>;
};

export default function LibraryBookList({
  books,
  bottomSentinelRef,
}: LibraryBookListProps) {
  return (
    <div className="px-gutter">
      <div className="grid grid-cols-2 gap-4">
        {books.map((book, index) => (
          <LibraryBookItem key={book.id + book.title + index} book={book} />
        ))}
      </div>
      {bottomSentinelRef && <div ref={bottomSentinelRef} />}
    </div>
  );
}
