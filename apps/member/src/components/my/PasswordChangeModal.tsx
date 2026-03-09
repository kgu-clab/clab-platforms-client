import { Button, Input, Modal } from "@clab/design-system";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useAuthStore } from "@/model/common/store-auth";

import { userQueries } from "@/api/user/api.query";
import { TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface PasswordChangeModalProps {
  onClose: () => void;
}

export default function PasswordChangeModal({
  onClose,
}: PasswordChangeModalProps) {
  const memberId = useAuthStore((s) => s.memberId);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const patchPassword = useMutation(userQueries.patchPasswordMutation);

  const handleSubmit = async () => {
    setError("");

    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!memberId) return;

    try {
      await patchPassword.mutateAsync({
        memberId,
        body: { password },
      });
      showSuccessToast(TOAST_MESSAGES.PASSWORD_UPDATE);
      onClose();
    } catch {
      // mutation onError에서 처리
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="비밀번호 변경">
      <div className="flex flex-col gap-3">
        <div>
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            variant="filled"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="ml-1 text-xs text-red-500">{error}</p>}
        <Button onClick={handleSubmit} disabled={patchPassword.isPending}>
          {patchPassword.isPending ? "변경 중..." : "변경하기"}
        </Button>
      </div>
    </Modal>
  );
}
