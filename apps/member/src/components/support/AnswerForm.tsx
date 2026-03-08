import { Button, Textarea } from "@clab/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supportKeys, supportQueries } from "@/api/support";
import { TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface AnswerFormProps {
  supportId: number;
  initialContent: string;
  mode: "create" | "edit";
  onCancel: () => void;
}

export default function AnswerForm({
  supportId,
  initialContent,
  mode,
  onCancel,
}: AnswerFormProps) {
  const [content, setContent] = useState(initialContent);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    ...supportQueries.postAnswerMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supportKeys.detail(supportId),
      });
      queryClient.invalidateQueries({
        queryKey: supportKeys.lists,
      });
      showSuccessToast(TOAST_MESSAGES.ANSWER_CREATE);
      onCancel();
    },
  });

  const updateMutation = useMutation({
    ...supportQueries.patchAnswerMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supportKeys.detail(supportId),
      });
      queryClient.invalidateQueries({
        queryKey: supportKeys.lists,
      });
      showSuccessToast(TOAST_MESSAGES.ANSWER_UPDATE);
      onCancel();
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (mode === "create") {
      createMutation.mutate({ supportId, body: { content } });
    } else {
      updateMutation.mutate({ supportId, content });
    }
  };

  return (
    <div className="gap-lg flex flex-col">
      <Textarea
        placeholder="답변을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        showCounter
      />
      <div className="gap-md mt-2 flex">
        <Button
          onClick={handleSubmit}
          disabled={
            !content.trim() ||
            createMutation.isPending ||
            updateMutation.isPending
          }
        >
          {mode === "create" ? "답변 등록" : "저장"}
        </Button>
        <Button color="outlineActive" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}
