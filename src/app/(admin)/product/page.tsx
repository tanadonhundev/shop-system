"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import AddProductForm from "@/components/app/AddProductForm";

export default function ProductPage() {
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(true);
  };
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mt-5">
        <Button onClick={handleAdd}>เพิ่มสินค้า</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>ราคา</TableHead>
            <TableHead>รวม</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.price.toLocaleString()}฿</TableCell>
              <TableCell>{(item.price * item.qty).toLocaleString()}฿</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      <AddProductForm open={open} onOpenChange={setOpen} />
    </div>
  );
}
