import { Button, Modal } from "@clab/design-system";
import { useRef, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQueries } from "@/api/user/api.query";

import { useAuthStore } from "@/model/common/store-auth";

import { ProfileImage } from "@/components/common";

import { TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface MyProfileHeaderProps {
  name?: string;
  id?: string;
  imageUrl?: string;
  roleLevel?: number;
  daysSinceJoin: number | null;
}

export default function MyProfileHeader({
  name,
  id,
  imageUrl,
  roleLevel,
  daysSinceJoin,
}: MyProfileHeaderProps) {
  const memberId = useAuthStore((s) => s.memberId);
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation(userQueries.postProfileFileMutation);
  const patchMutation = useMutation(userQueries.patchMemberMutation);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !memberId) return;

    try {
      const fileResult = await uploadMutation.mutateAsync(selectedFile);
      await patchMutation.mutateAsync({
        memberId,
        body: { imageUrl: fileResult.fileUrl },
      });
      queryClient.invalidateQueries({ queryKey: userQueries.infoKey() });
      setIsModalOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      showSuccessToast(TOAST_MESSAGES.PROFILE_IMAGE_UPDATE);
    } catch {}
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="gap-2xl pb-lg flex items-center">
        <div className="relative">
          <ProfileImage imageUrl={imageUrl} size="size-20" role={roleLevel} />
          <button
            type="button"
            className="bg-gray-1 border-gray-3 absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border"
            onClick={() => setIsModalOpen(true)}
          >
            <IoSettingsOutline size={14} className="text-gray-5" />
          </button>
        </div>
        <div>
          <p className="text-16-semibold text-black">
            {name ?? "-"}({id ?? "-"})
          </p>
          {daysSinceJoin !== null && (
            <p className="text-12-regular text-gray-4">
              함께한 지 {daysSinceJoin}일째
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="프로필 이미지 변경"
      >
        <div className="flex flex-col items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="미리보기"
              className="size-32 rounded-full object-cover"
            />
          ) : (
            <div className="bg-gray-2 flex size-32 items-center justify-center rounded-full">
              <p className="text-13-regular text-gray-4">이미지 없음</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex w-full gap-2">
            <Button
              color="ghost"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              사진 선택
            </Button>
            <Button
              className="flex-1"
              onClick={handleImageUpload}
              disabled={
                !selectedFile ||
                uploadMutation.isPending ||
                patchMutation.isPending
              }
            >
              {uploadMutation.isPending || patchMutation.isPending
                ? "업로드 중..."
                : "변경하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
