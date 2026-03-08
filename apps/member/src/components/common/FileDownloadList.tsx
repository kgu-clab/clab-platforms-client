import { IoDownloadOutline } from "react-icons/io5";

import { BASE_FILE_URL } from "@/api/config";

interface FileInfo {
  fileUrl: string;
  originalFileName: string;
}

interface FileDownloadListProps {
  files: FileInfo[];
}

async function handleDownload(fileUrl: string, fileName: string) {
  const res = await fetch(`${BASE_FILE_URL}${fileUrl}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FileDownloadList({ files }: FileDownloadListProps) {
  if (files.length === 0) return null;

  return (
    <div className="gap-sm flex flex-col">
      <p className="text-13-medium text-gray-4 mb-2">
        첨부파일 ({files.length})
      </p>
      {files.map((file) => (
        <button
          key={file.fileUrl}
          type="button"
          onClick={() => handleDownload(file.fileUrl, file.originalFileName)}
          className="bg-gray-1 px-lg py-md gap-md flex items-center rounded-md"
        >
          <IoDownloadOutline className="text-gray-4 size-4 shrink-0" />
          <span className="text-13-regular truncate text-black">
            {file.originalFileName}
          </span>
        </button>
      ))}
    </div>
  );
}
