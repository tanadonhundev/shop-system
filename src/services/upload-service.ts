import { NextRequest } from "next/server";
import { createWriteStream, unlinkSync } from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import Busboy from "busboy";
import { Readable } from "stream";
import { v4 as uuid } from "uuid";

export async function handleFileUpload(req: NextRequest): Promise<{ files: string[], formData: FormData }> {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const headers = Object.fromEntries(req.headers.entries());
    const bb = Busboy({ headers });
    const files: string[] = [];
    const formData = new FormData();

    bb.on("file", (_fieldname, file, info) => {
      const extension = path.extname(info.filename);
      const saveTo = path.join(uploadDir, uuid() + extension || "file.dat");
      file.pipe(createWriteStream(saveTo));
      files.push(path.basename(saveTo));
    });

    bb.on("field", (fieldname, val) => {
      formData.append(fieldname, val);
    });

    bb.on("finish", () => {
      resolve({ files, formData });
    });

    bb.on("error", (err) => {
      reject(err);
    });

    const reader = req.body?.getReader();

    if (!reader) {
      return reject(new Error("No request body"));
    }

    const stream = new Readable({
      async read() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          this.push(value);
        }
        this.push(null);
      },
    });

    stream.pipe(bb);
  });
}


export async function deleteImagesFromServer(images: { imageName: string }[]) {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    for (const item of images) {
        const imagePath = path.join(uploadsDir, item.imageName);
        console.log(imagePath);
        unlinkSync(imagePath);
    }
}