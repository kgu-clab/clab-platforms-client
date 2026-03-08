import { Modal } from "@clab/design-system";
import { useState } from "react";

import { BASE_FILE_URL } from "@/api/config";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="scrollbar-hide gap-md flex overflow-x-auto">
        {imageFiles.map((file) => (
          <img
            key={file.fileUrl}
            src={`${BASE_FILE_URL}${file.fileUrl}`}
            alt={file.originalFileName}
            className="aspect-9/16 h-48 shrink-0 cursor-pointer rounded-lg object-cover"
            onClick={() => setSelectedImage(`${BASE_FILE_URL}${file.fileUrl}`)}
          />
        ))}
      </div>

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size="large"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="확대 이미지"
            className="w-full object-contain"
          />
        )}
      </Modal>
    </>
  );
}
