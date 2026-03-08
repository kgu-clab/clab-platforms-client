import { isImageFile } from "@/utils/file";

interface FileInfo {
  fileUrl: string;
  originalFileName: string;
}

interface ImageInlineListProps {
  files: FileInfo[];
}

export default function ImageInlineList({ files }: ImageInlineListProps) {
  const imageFiles = files.filter((f) => isImageFile(f.originalFileName));

  if (imageFiles.length === 0) return null;

  return (
    <div className="gap-md flex flex-col">
      {imageFiles.map((file) => (
        <img
          key={file.fileUrl}
          src={file.fileUrl}
          alt={file.originalFileName}
          className="max-h-75 w-full rounded-lg object-contain"
        />
      ))}
    </div>
  );
}
