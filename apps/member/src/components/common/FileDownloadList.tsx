import { IoDownloadOutline } from "react-icons/io5";

interface FileInfo {
  fileUrl: string;
  originalFileName: string;
}

interface FileDownloadListProps {
  files: FileInfo[];
}

export default function FileDownloadList({ files }: FileDownloadListProps) {
  if (files.length === 0) return null;

  return (
    <div className="gap-sm flex flex-col">
      <p className="text-13-medium text-gray-4 mb-2">
        첨부파일 ({files.length})
      </p>
      {files.map((file) => (
        <a
          key={file.fileUrl}
          href={file.fileUrl}
          download={file.originalFileName}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-1 px-lg py-md gap-md flex items-center rounded-md"
        >
          <IoDownloadOutline className="text-gray-4 size-4 shrink-0" />
          <span className="text-13-regular truncate text-black">
            {file.originalFileName}
          </span>
        </a>
      ))}
    </div>
  );
}
