import { Chip } from "@clab/design-system";

function getCategoryLabel(category: string) {
  switch (category) {
    case "free":
    case "FREE":
      return "자유";
    case "development_qna":
    case "DEVELOPMENT_QNA":
      return "질문";
    case "IT 소식":
      return "IT 소식";
    case "notice":
    case "NOTICE":
      return "공지";
    case "job":
      return "채용";
    default:
      return category;
  }
}

export default function CommunityCategoryChip({
  category,
}: {
  category: string;
}) {
  return <Chip>{getCategoryLabel(category)}</Chip>;
}
