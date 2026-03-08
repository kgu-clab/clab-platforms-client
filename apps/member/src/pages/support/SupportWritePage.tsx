import {
  Button,
  Dropdown,
  Header,
  Input,
  Scrollable,
  Section,
  Textarea,
  Title,
} from "@clab/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import {
  IoChevronDown,
  IoClose,
  IoDocumentAttachOutline,
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";

import { supportKeys, supportQueries } from "@/api/support";
import type {
  SupportCategory,
  SupportFileInfo,
  SupportWriteForm,
} from "@/api/support";
import { ROUTE, TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface EditState {
  editMode: true;
  supportId: number;
  title: string;
  content: string;
  category: SupportCategory;
  returnState?: {
    showAllSupports: boolean;
  };
}

const CATEGORY_LABELS: Record<SupportCategory, string> = {
  INQUIRY: "일반 문의",
  BUG: "버그 신고",
};

export default function SupportWritePage() {
  const location = useLocation();
  const editState = location.state as EditState | null;
  const isEditMode = !!editState?.editMode;

  const [form, setForm] = useState<SupportWriteForm>({
    category: editState?.category ?? "INQUIRY",
    title: editState?.title ?? "",
    content: editState?.content ?? "",
    fileUrlList: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<SupportFileInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fileMutation = useMutation({
    ...supportQueries.postSupportFileMutation,
    onSuccess: (data) => {
      if (data.ok) {
        const newFiles = data.data.data;
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setForm((prev) => ({
          ...prev,
          fileUrlList: [...prev.fileUrlList, ...newFiles.map((f) => f.fileUrl)],
        }));
      }
    },
  });

  const createMutation = useMutation({
    ...supportQueries.postSupportMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.lists });
      showSuccessToast(TOAST_MESSAGES.SUPPORT_CREATE);
      navigate(ROUTE.SUPPORT);
    },
  });

  const editMutation = useMutation({
    ...supportQueries.patchSupportMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.lists });
      showSuccessToast(TOAST_MESSAGES.SUPPORT_UPDATE);
      if (editState) {
        queryClient.invalidateQueries({
          queryKey: supportKeys.detail(editState.supportId),
        });

        navigate(ROUTE.SUPPORT_DETAIL(editState.supportId), {
          replace: true,
        });
      }
    },
  });

  const handleCategoryChange = (newCategory: SupportCategory) => {
    setForm((prev) => ({ ...prev, content: "", category: newCategory }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      fileMutation.mutate({ storagePeriod: 365, files });
    }
    e.target.value = "";
  };

  const handleRemoveFile = (fileUrl: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fileUrl !== fileUrl));
    setForm((prev) => ({
      ...prev,
      fileUrlList: prev.fileUrlList.filter((url) => url !== fileUrl),
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    if (isEditMode && editState) {
      const hasChanges =
        form.title !== editState.title ||
        form.content !== editState.content ||
        form.category !== editState.category;

      if (!hasChanges) {
        navigate(ROUTE.SUPPORT_DETAIL(editState.supportId), { replace: true });
        return;
      }

      editMutation.mutate({
        supportId: editState.supportId,
        body: {
          title: form.title !== editState.title ? form.title : undefined,
          content:
            form.content !== editState.content ? form.content : undefined,
          category:
            form.category !== editState.category ? form.category : undefined,
        },
      });
    } else {
      createMutation.mutate({
        title: form.title,
        content: form.content,
        category: form.category,
        fileUrlList: form.fileUrlList.length > 0 ? form.fileUrlList : undefined,
      });
    }
  };

  const isPending = isEditMode
    ? editMutation.isPending
    : createMutation.isPending;

  const isSubmitDisabled =
    !form.title.trim() ||
    !form.content.trim() ||
    isPending ||
    fileMutation.isPending;

  return (
    <>
      <Header
        left={
          <button
            onClick={() =>
              editState
                ? navigate(ROUTE.SUPPORT_DETAIL(editState.supportId), {
                    replace: true,
                  })
                : navigate(-1)
            }
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>{isEditMode ? "문의 수정" : "문의 작성"}</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="gap-3xl pt-header-height">
        <Section
          className="gap-xl"
          title={
            <h2 className="text-18-semibold pt-md px-gutter text-black">
              제목을 입력해주세요.
            </h2>
          }
        >
          <div className="px-gutter">
            <Input
              placeholder="제목을 입력해주세요"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              variant="underline"
            />
          </div>
        </Section>

        <Section
          className="gap-xl"
          title={
            <h2 className="text-18-semibold pt-md px-gutter text-black">
              카테고리를 선택해주세요.
            </h2>
          }
        >
          <div className="px-gutter">
            <Dropdown
              trigger={
                <Button
                  color={form.category ? "outlineActive" : "outlineDisabled"}
                  size="small"
                >
                  {CATEGORY_LABELS[form.category]}
                  <IoChevronDown className="ml-xs" />
                </Button>
              }
              align="start"
            >
              <Dropdown.Item onSelect={() => handleCategoryChange("INQUIRY")}>
                일반 문의
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => handleCategoryChange("BUG")}>
                버그 신고
              </Dropdown.Item>
            </Dropdown>
          </div>
        </Section>

        <Section
          className="gap-xl"
          title={
            <h2 className="text-18-semibold pt-md px-gutter text-black">
              내용을 입력해주세요.
            </h2>
          }
        >
          <div className="px-gutter">
            <Textarea
              placeholder={
                form.category === "BUG"
                  ? "어떤 문제가 발생했나요?\n재현 방법, 사용 환경(브라우저/기기)을 알려주세요."
                  : "문의 내용을 입력하세요"
              }
              size="large"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              maxLength={1000}
              showCounter
              className="scrollbar-hide"
            />
          </div>
        </Section>

        {!isEditMode && uploadedFiles.length > 0 && (
          <Section className="gap-sm px-gutter">
            <p className="text-13-medium text-gray-4">
              첨부파일 ({uploadedFiles.length})
            </p>
            {uploadedFiles.map((file) => (
              <div
                key={file.fileUrl}
                className="bg-gray-1 px-lg py-md gap-md flex items-center rounded-md"
              >
                <span className="text-13-regular min-w-0 flex-1 truncate text-black">
                  {file.originalFileName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.fileUrl)}
                  className="text-gray-4 shrink-0"
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </Section>
        )}

        {fileMutation.isPending && (
          <div className="px-gutter">
            <p className="text-13-regular text-gray-4">업로드 중...</p>
          </div>
        )}

        <Section className="gap-lg px-gutter pb-xl">
          {!isEditMode && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="gap-xs flex items-center"
                type="button"
              >
                <IoDocumentAttachOutline size={20} className="text-gray-3" />
                <p className="text-13-medium text-gray-3">파일 첨부</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}
          <Button
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isEditMode ? "수정 완료" : "문의 등록"}
          </Button>
        </Section>
      </Scrollable>
    </>
  );
}
