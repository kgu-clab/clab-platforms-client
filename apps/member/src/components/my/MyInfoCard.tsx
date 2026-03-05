import { Field, Input } from "@clab/design-system";
import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQueries } from "@/api/user/api.query";

import { useAuthStore } from "@/model/common/store-auth";

import { TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface MyInfoCardProps {
  contact?: string;
  email?: string;
  githubUrl?: string;
}

export default function MyInfoCard({
  contact,
  email,
  githubUrl,
}: MyInfoCardProps) {
  const memberId = useAuthStore((s) => s.memberId);
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    contact: "",
    email: "",
    githubUrl: "",
  });
  const [editErrors, setEditErrors] = useState({
    contact: "",
    email: "",
    githubUrl: "",
  });

  const patchMutation = useMutation(userQueries.patchMemberMutation);

  const handleEditStart = () => {
    setEditForm({
      contact: contact ?? "",
      email: email ?? "",
      githubUrl: githubUrl ?? "",
    });
    setEditErrors({ contact: "", email: "", githubUrl: "" });
    setIsEditing(true);
  };

  const validateEditForm = () => {
    const errors = { contact: "", email: "", githubUrl: "" };
    let isValid = true;

    if (editForm.contact && !/^010\d{8}$/.test(editForm.contact)) {
      errors.contact = "하이픈 없이 숫자만 입력해주세요.";
      isValid = false;
    }

    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }

    if (
      editForm.githubUrl &&
      !/^https?:\/\/github\.com\/.+$/.test(editForm.githubUrl)
    ) {
      errors.githubUrl = "올바른 GitHub URL 형식이 아닙니다.";
      isValid = false;
    }

    setEditErrors(errors);
    return isValid;
  };

  const handleEditSave = async () => {
    if (!memberId) return;
    if (!validateEditForm()) return;

    try {
      await patchMutation.mutateAsync({
        memberId,
        body: editForm,
      });
      queryClient.invalidateQueries({ queryKey: userQueries.infoKey() });
      setIsEditing(false);
      showSuccessToast(TOAST_MESSAGES.PROFILE_UPDATE);
    } catch {}
  };

  return (
    <div className="bg-gray-1 mt-3 rounded-2xl px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-14-semibold text-black">내 정보</p>
        {!isEditing ? (
          <button
            type="button"
            className="text-12-regular text-gray-5"
            onClick={handleEditStart}
          >
            수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              className="text-12-regular text-gray-5"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="text-12-regular text-blue-500"
              onClick={handleEditSave}
              disabled={patchMutation.isPending}
            >
              {patchMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isEditing ? (
          <>
            <div>
              {editErrors.contact && (
                <p className="mb-1 ml-1 text-xs text-red-500">
                  {editErrors.contact}
                </p>
              )}
              <Input
                placeholder="연락처"
                value={editForm.contact}
                variant="filled"
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
            </div>
            <div>
              {editErrors.email && (
                <p className="mb-1 ml-1 text-xs text-red-500">
                  {editErrors.email}
                </p>
              )}
              <Input
                placeholder="이메일"
                value={editForm.email}
                variant="filled"
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div>
              {editErrors.githubUrl && (
                <p className="mb-1 ml-1 text-xs text-red-500">
                  {editErrors.githubUrl}
                </p>
              )}
              <Input
                placeholder="GitHub URL"
                value={editForm.githubUrl}
                variant="filled"
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    githubUrl: e.target.value,
                  }))
                }
              />
            </div>
          </>
        ) : (
          <>
            <Field title="연락처" description={contact || "-"} />
            <Field title="이메일" description={email || "-"} />
            <Field title="GitHub" description={githubUrl || "-"} />
          </>
        )}
      </div>
    </div>
  );
}
