import { Header, Scrollable, Title } from "@clab/design-system";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import type { BookData } from "@/types/library";

import { LibraryBookItem } from "@/components/library";

import type { Book } from "@/api/library/api.type";
import { MOCK_MY_BOOKS } from "@/mock/my";

function toBook(data: BookData): Book {
  return {
    ...data,
    borrowerId: data.borrowerId != null ? String(data.borrowerId) : "",
    borrowerName: data.borrowerName ?? "",
    dueDate: data.dueDate ?? "",
  };
}

export default function MyLibraryPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>도서 대여 내역</Title>
          </button>
        }
        className="z-100 absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height pb-bottom-padding">
        <div className="px-gutter py-xl grid grid-cols-2 gap-4">
          {MOCK_MY_BOOKS.map((book, index) => (
            <LibraryBookItem key={`${book.id}-${index}`} book={toBook(book)} />
          ))}
        </div>
      </Scrollable>
    </>
  );
}
