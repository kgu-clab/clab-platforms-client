import { IoSearch } from "react-icons/io5";

type LibrarySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function LibrarySearchBar({
  value,
  onChange,
}: LibrarySearchBarProps) {
  return (
    <div className="px-gutter">
      <div className="border-gray-2 gap-md flex items-center rounded-lg border px-4 py-3">
        <input
          type="text"
          placeholder="도서명을 입력해주세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.target as HTMLInputElement).blur()
          }
          className="text-14-regular placeholder:text-gray-3 flex-1 bg-transparent outline-none"
        />
        <button type="button" className="text-gray-4">
          <IoSearch className="size-5" />
        </button>
      </div>
    </div>
  );
}
