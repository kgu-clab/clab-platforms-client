import type { SupportDetail } from "@/api/support";
import { formatRelativeTime } from "@/utils/date";

interface AnswerContentProps {
  answer: NonNullable<SupportDetail["answer"]>;
  isAdmin: boolean;
  onAnswerEdit: () => void;
  onAnswerDelete: () => void;
}

export default function AnswerContent({
  answer,
  isAdmin,
  onAnswerEdit,
  onAnswerDelete,
}: AnswerContentProps) {
  const { content, createdAt, responder } = answer;

  return (
    <div className="bg-gray-1 gap-sm scrollbar-hide mt-3 flex max-h-48 w-full flex-col overflow-y-auto rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-13-medium text-gray-4">답변</span>
        {isAdmin && (
          <div className="gap-sm flex">
            <button
              type="button"
              className="text-12-regular text-gray-4"
              onClick={onAnswerEdit}
            >
              수정
            </button>
            <button
              type="button"
              className="text-12-regular text-gray-4"
              onClick={onAnswerDelete}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <p className="scrollbar-hide whitespace-pre-wrap text-xs text-black">
        {content}
      </p>
      <div className="text-12-regular text-gray-4">
        {formatRelativeTime(createdAt)} | {responder}
      </div>
    </div>
  );
}
