/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/cart-store";

type AppCartBtnProps = {
  product: any;
  onAddToCart?: () => void;
};

export const AppCartBtn = ({ product, onAddToCart }: AppCartBtnProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.productName,
      price: product.price,
      qty: 1,
    });

    if (onAddToCart) {
      onAddToCart(); // ลด stock ใน UI
    }
  };

  return (
    <Button
      className="mt-2 w-full"
      onClick={handleAdd}
      disabled={product.stock === 0}
    >
      <ShoppingCart /> เพิ่มลงรถเข็น
    </Button>
  );
};
