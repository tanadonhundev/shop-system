import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import axios from "axios";
import { UploadPreview } from "./UploadPreview";

const formSchema = z.object({
  productName: z.string().min(1, "ชื่อสินค้าห้ามว่าง"),
  price: z
    .string()
    .transform((val) => parseFloat(val.replace(/[^0-9.]/g, "")))
    .refine((val) => !isNaN(val), "ราคาต้องเป็นตัวเลขที่ถูกต้อง"),
  stock: z
    .string()
    .transform((val) => parseFloat(val.replace(/[^0-9.]/g, "")))
    .refine((val) => !isNaN(val), "ราคาต้องเป็นตัวเลขที่ถูกต้อง"),

  image: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size > 0, "ไฟล์ต้องไม่ว่างเปล่า")
      )
      .min(1, "ภาพสินค้าห้ามว่าง")
      .max(1, "อัปโหลดได้ไม่เกิน 1 รูป")
      .superRefine((files, ctx) => {
        files.forEach((file, i) => {
          if (file.size > 5 * 1024 * 1024) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "ขนาดไฟล์ต้องไม่เกิน 5MB",
              path: [i],
            });
          }
        });
      })
  ),
});

type formvalutes = z.infer<typeof formSchema>;

type AddProductFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddProductForm = ({ open, onOpenChange }: AddProductFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onsubmit = async (data: formvalutes) => {
    try {
      const formData = new FormData();
      data.image.forEach((file) => {
        formData.append("image", file);
      });

      const resUpload = await axios.post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFiles = resUpload.data.files;

      const varules = {
        productName: data.productName,
        price: data.price,
        stock: data.stock,
        images: uploadedFiles,
      };

      // ส่งต่อข้อมูลไปยัง API Node.js
      const resFinal = await axios.post(
        `${process.env.NEXT_PUBLIC_API_NODE}/api/products`,
        varules,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Final API result:", resFinal.data);
    } catch (error) {
      console.error("Submit error:", error);
    }

    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มข้อมูลสินค้า</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                ชื่อสินค้า
              </Label>
              <Input
                id="productName"
                className="col-span-3"
                {...register("productName")}
              />
              {errors.productName && (
                <p className="text-red-500 col-span-4 ml-28">
                  {errors.productName.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                ราคา
              </Label>
              <Input id="price" className="col-span-3" {...register("price")} />
              {errors.price && (
                <p className="text-red-500 col-span-4 ml-28">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stcok" className="text-right">
                จำนวน
              </Label>
              <Input id="stcok" className="col-span-3" {...register("stock")} />
              {errors.stock && (
                <p className="text-red-500 col-span-4 ml-28">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <UploadPreview
                onChange={field.onChange}
                value={field.value as File[]}
                error={errors.image?.message}
              />
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "กำลังบันทึก" : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
