import { Button, Modal } from "@clab/design-system";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onClose,
  confirmLabel = "확인",
  cancelLabel = "취소",
}: ConfirmModalProps) {
  return (
    <Modal isOpen onClose={onClose} title="확인">
      <div className="gap-lg flex flex-col">
        <p className="text-14-regular text-black">{message}</p>
        <div className="gap-md flex justify-end">
          <Button size="small" color="outlineActive" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button size="small" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
