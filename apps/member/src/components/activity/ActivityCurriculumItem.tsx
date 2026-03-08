import { Input } from "@clab/design-system";
import { IoChevronForward } from "react-icons/io5";

import { cn } from "@/utils/cn";

export interface ActivityCurriculumItemProps {
  label: string;
  content: string;
  isEditing: boolean;
  onContentChange: (value: string) => void;
  onStartEdit: () => void;
  onEndEdit: () => void;
  className?: string;
}

export default function ActivityCurriculumItem({
  label,
  content,
  isEditing,
  onContentChange,
  onStartEdit,
  onEndEdit,
  className,
}: ActivityCurriculumItemProps) {
  if (isEditing) {
    return (
      <div
        className={cn(
          "bg-gray-0 border-gray-2 gap-sm p-xl flex w-full flex-col rounded-md border",
          className,
        )}
      >
        <p className="text-15-medium text-gray-5">{label}</p>
        <Input
          type="text"
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onBlur={onEndEdit}
          variant="underline"
          className="min-h-[40px]"
          autoFocus
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStartEdit}
      className={cn(
        "bg-gray-0 border-gray-2 p-xl flex w-full items-start justify-between rounded-md border text-left",
        className,
      )}
    >
      <div className="gap-xs flex flex-col">
        <p className="text-15-medium text-gray-5">{label}</p>
        {content ? (
          <p className="text-14-regular text-gray-7 line-clamp-2">{content}</p>
        ) : (
          <p className="text-14-regular text-gray-4">내용 입력하기</p>
        )}
      </div>
      <IoChevronForward size={16} className="text-gray-5 shrink-0" />
    </button>
  );
}
