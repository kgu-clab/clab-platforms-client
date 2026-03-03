import {
  Header,
  Scrollable,
  Textarea,
  Input,
  Section,
  Button,
} from "@clab/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";

import type { BoardCategory, BoardFileInfo } from "@/api/community";
import { boardKeys, boardQueries } from "@/api/community";

import {
  CommunityWriteSelector,
  CommunityWriteBottomBar,
} from "@/components/community";

import { ROUTE } from "@/constants";

interface EditState {
  editMode: true;
  boardId: number;
  title: string;
  content: string;
  category: string;
  hashtagNames: string[];
  files: BoardFileInfo[];
  wantAnonymous: boolean;
}

interface WriteFormState {
  title: string;
  content: string;
  category: BoardCategory;
  hashtags: string[];
  isAnonymous: boolean;
  files: BoardFileInfo[];
}

export default function CommunityWritePage() {
  const location = useLocation();
  const editState = location.state as EditState | null;
  const isEditMode = !!editState?.editMode;

  const [form, setForm] = useState<WriteFormState>({
    title: editState?.title ?? "",
    content: editState?.content ?? "",
    category: (editState?.category as BoardCategory) ?? "FREE",
    hashtags: editState?.hashtagNames ?? [],
    isAnonymous: editState?.wantAnonymous ?? false,
    files: editState?.files ?? [],
  });

  const updateForm = <K extends keyof WriteFormState>(
    key: K,
    value: WriteFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxContentLength = 1000;

  const postBoardMutation = useMutation({
    ...boardQueries.postBoardMutation,
    onSuccess: () => {
      navigate(ROUTE.COMMUNITY);
    },
  });

  const patchBoardMutation = useMutation({
    ...boardQueries.patchBoardMutation,
    onSuccess: () => {
      if (editState) {
        queryClient.invalidateQueries({
          queryKey: boardKeys.detail(editState.boardId),
        });
      }
      navigate(-1);
    },
  });

  const uploadFileMutation = useMutation({
    ...boardQueries.postBoardFileMutation,
    onSuccess: (data) => {
      setForm((prev) => ({ ...prev, files: [...prev.files, ...data] }));
    },
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (isEditMode && editState) {
      patchBoardMutation.mutate({
        boardId: editState.boardId,
        body: {
          wantAnonymous: form.isAnonymous,
          category: form.category,
          title: form.title,
          content: form.content,
          hashtagNames: form.hashtags.length > 0 ? form.hashtags : undefined,
        },
      });
    } else {
      postBoardMutation.mutate({
        category: form.category,
        title: form.title,
        content: form.content,
        wantAnonymous: form.isAnonymous,
        hashtagNames: form.hashtags.length > 0 ? form.hashtags : undefined,
        fileUrlList:
          form.files.length > 0 ? form.files.map((f) => f.fileUrl) : undefined,
      });
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadFileMutation.mutate(Array.from(files));
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const isSubmitDisabled =
    !form.title.trim() ||
    !form.content.trim() ||
    postBoardMutation.isPending ||
    patchBoardMutation.isPending;

  return (
    <>
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <GoChevronLeft size={24} />
          </button>
        }
        className="fixed left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="gap-3xl pt-header-height">
        <Section
          className="gap-xl"
          title={
            <h2 className="text-18-semibold pt-md px-gutter text-black">
              글 제목을 입력해주세요.
            </h2>
          }
        >
          <div className="px-gutter">
            <Input
              type="text"
              placeholder="제목을 입력해주세요"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
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
            <CommunityWriteSelector
              selectedCategory={form.category}
              onSelectCategory={(cat) => updateForm("category", cat)}
              selectedHashtags={form.hashtags}
              onSelectHashtag={(tags) => updateForm("hashtags", tags)}
            />
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
              placeholder="어떤 이야기를 나누고 싶으신가요?"
              value={form.content}
              onChange={(e) => updateForm("content", e.target.value)}
              maxLength={maxContentLength}
              showCounter={true}
            />
          </div>
        </Section>

        {form.files.length > 0 && (
          <Section className="gap-md px-gutter">
            <p className="text-13-medium text-gray-4">
              첨부파일 ({form.files.length})
            </p>
            <div className="gap-sm flex flex-col">
              {form.files.map((file, index) => (
                <div
                  key={file.fileUrl}
                  className="bg-gray-1 gap-md px-lg py-md flex items-center justify-between rounded-md"
                >
                  <span className="text-13-regular truncate text-black">
                    {file.originalFileName}
                  </span>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-4 shrink-0"
                    >
                      <IoClose size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {uploadFileMutation.isPending && (
          <div className="px-gutter">
            <p className="text-13-regular text-gray-4">업로드 중...</p>
          </div>
        )}

        <Section className="gap-md px-gutter">
          <Button
            size="small"
            onClick={() => updateForm("isAnonymous", !form.isAnonymous)}
            color={form.isAnonymous ? "outlineActive" : "outlineDisabled"}
          >
            {form.isAnonymous ? "익명 해제" : "익명"}
          </Button>
        </Section>
      </Scrollable>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <CommunityWriteBottomBar
        onImageClick={isEditMode ? undefined : handleImageClick}
        onFileClick={isEditMode ? undefined : handleFileClick}
        onSubmit={handleSubmit}
        disabled={isSubmitDisabled}
        isEditMode={isEditMode}
      />
    </>
  );
}
