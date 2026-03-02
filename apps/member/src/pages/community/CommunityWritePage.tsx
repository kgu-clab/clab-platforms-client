import {
  Header,
  Scrollable,
  Textarea,
  Input,
  Section,
  Button,
} from "@clab/design-system";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router";

import type { BoardCategory, BoardFileInfo } from "@/api/community";
import { boardQueries } from "@/api/community";

import {
  CommunityWriteSelector,
  CommunityWriteBottomBar,
} from "@/components/community";

import { ROUTE } from "@/constants";

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BoardCategory>("FREE");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<BoardFileInfo[]>([]);
  const navigate = useNavigate();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxContentLength = 1000;

  const postBoardMutation = useMutation({
    ...boardQueries.postBoardMutation,
    onSuccess: () => {
      navigate(ROUTE.COMMUNITY);
    },
  });

  const uploadFileMutation = useMutation({
    ...boardQueries.postBoardFileMutation,
    onSuccess: (data) => {
      setUploadedFiles((prev) => [...prev, ...data]);
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    postBoardMutation.mutate({
      category: selectedCategory,
      title,
      content,
      wantAnonymous: isAnonymous,
      hashtagNames: selectedHashtags.length > 0 ? selectedHashtags : undefined,
      fileUrlList:
        uploadedFiles.length > 0
          ? uploadedFiles.map((f) => f.fileUrl)
          : undefined,
    });
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
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isSubmitDisabled =
    !title.trim() || !content.trim() || postBoardMutation.isPending;

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedHashtags={selectedHashtags}
              onSelectHashtag={setSelectedHashtags}
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxContentLength}
              showCounter={true}
            />
          </div>
        </Section>

        {uploadedFiles.length > 0 && (
          <Section className="gap-md px-gutter">
            <p className="text-13-medium text-gray-4">
              첨부파일 ({uploadedFiles.length})
            </p>
            <div className="gap-sm flex flex-col">
              {uploadedFiles.map((file, index) => (
                <div
                  key={file.fileUrl}
                  className="bg-gray-1 gap-md px-lg py-md flex items-center justify-between rounded-md"
                >
                  <span className="text-13-regular truncate text-black">
                    {file.originalFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-4 shrink-0"
                  >
                    <IoClose size={16} />
                  </button>
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
            onClick={() => setIsAnonymous(!isAnonymous)}
            color={isAnonymous ? "outlineActive" : "outlineDisabled"}
          >
            {isAnonymous ? "익명 해제" : "익명"}
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
        onImageClick={handleImageClick}
        onFileClick={handleFileClick}
        onSubmit={handleSubmit}
        disabled={isSubmitDisabled}
      />
    </>
  );
}
