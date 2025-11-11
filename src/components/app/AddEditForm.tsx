/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useForm } from "react-hook-form";
import z from "zod";

import axios from "axios";
import { useEffect } from "react";

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
});

type formvalutes = z.infer<typeof formSchema>;

const AddEditForm = ({ open, onOpenChange, product }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      price: "",
      stock: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
      });
    } else {
      reset({
        productName: "",
        price: "",
        stock: "",
      });
    }
  }, [product, reset]);
  const onsubmit = async (data: formvalutes) => {
    if (!product?.id) {
      console.error("Product ID not found for update");
      return;
    }
    const payload = {
      productName: data.productName,
      price: data.price,
      stock: data.stock,
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_NODE}/api/products/${product.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productName" className="text-right">
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
              <Label htmlFor="stock" className="text-right">
                จำนวน
              </Label>
              <Input id="stock" className="col-span-3" {...register("stock")} />
              {errors.stock && (
                <p className="text-red-500 col-span-4 ml-28">
                  {errors.stock.message}
                </p>
              )}
            </div>
            {/* <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <UploadPreview
                  onChange={field.onChange}
                  value={field.value as File[]}
                  error={errors.image?.message}
                />
              )}
            /> */}
          </div>

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

export default AddEditForm;
