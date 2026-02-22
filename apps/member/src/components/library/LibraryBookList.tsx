import { MOCK_BOOKS } from "@/mock/library";

import LibraryBookItem from "./LibraryBookItem";

export default function LibraryBookList() {
  return (
    <div className="px-gutter">
      <div className="grid grid-cols-2 gap-4">
        {MOCK_BOOKS.map((book) => (
          <LibraryBookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
