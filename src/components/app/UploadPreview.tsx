// components/UploadPreview.tsx
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export type PreviewFile = File & { preview: string };

type UploadPreviewProps = {
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
};

export function UploadPreview({ onChange, value = [], error }: UploadPreviewProps) {
  const [files, setFiles] = useState<PreviewFile[]>(
    value.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    )
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const withPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prevFiles) => [...prevFiles, ...withPreview]);
      onChange([...files, ...acceptedFiles]);
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleRemove = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "cursor-pointer border-dashed border-2 p-4 text-center rounded-md",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">
          ลากและวางรูปภาพ (สูงสุด 5 รูป) หรือคลิกเพื่อเลือก
        </p>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="grid grid-cols-2 gap-2 mt-4 h-32 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={file.name}
            className="flex flex-col border rounded-sm w-[200px] p-1 box-border"
          >
              <button
                type="button"
                onClick={() => handleRemove(index)}
              >
                x
              </button>
              <Image
                src={file.preview}
                alt={file.name}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: 100 }}
                priority
              />
          </div>
        ))}
      </div>
    </div>
  );
}