import { Button } from "@clab/design-system";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { MdOutlineImage } from "react-icons/md";

interface CommunityWriteBottomBarProps {
  onImageClick?: () => void;
  onFileClick?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  isEditMode?: boolean;
}

export default function CommunityWriteBottomBar({
  onImageClick,
  onFileClick,
  onSubmit,
  disabled = false,
  isEditMode = false,
}: CommunityWriteBottomBarProps) {
  return (
    <div className="border-gray-2 gap-lg p-xl fixed bottom-0 left-0 right-0 flex flex-col border-t bg-white shadow-[0px_4px_100px_0px_rgba(0,0,0,0.05)]">
      {!isEditMode && (
        <div className="flex w-full items-center gap-2.5">
          <button
            onClick={onImageClick}
            className="gap-xs flex items-center"
            type="button"
          >
            <MdOutlineImage size={20} className="text-gray-3" />
            <p className="text-13-medium text-gray-3">사진</p>
          </button>
          <button
            onClick={onFileClick}
            className="gap-xs flex items-center"
            type="button"
          >
            <IoDocumentAttachOutline size={20} className="text-gray-3" />
            <p className="text-13-medium text-gray-3">파일</p>
          </button>
        </div>
      )}
      <Button
        size="large"
        color={disabled ? "disabled" : "active"}
        onClick={onSubmit}
        disabled={disabled}
      >
        {isEditMode ? "수정하기" : "글 작성하기"}
      </Button>
    </div>
  );
}
