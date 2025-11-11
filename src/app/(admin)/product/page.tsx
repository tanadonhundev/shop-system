"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
  TableCell,
} from "@/components/ui/table";
import AddProductForm from "@/components/app/AddProductForm";
import axios from "axios";
import { AlertDialogDelete } from "@/components/app/AlertDialogDelete";
import AddEditForm from "@/components/app/AddEditForm";

type Product = {
  id: number;
  productName: string;
  price: string;
  stock: number;
  createdAt: string;
};

type ProductImage = {
  id: number;
  productId: number;
  imageName: string;
  createdAt: string | null;
};

// API response type
type ApiProductResponse = {
  products: Product;
  product_image: ProductImage;
};

// Component type
type ProductWithImage = Product & {
  productImages: ProductImage[];
};

// Fetch products function
const fetchProducts = async (): Promise<ProductWithImage[]> => {
  const res = await axios.get<ApiProductResponse[]>(
    `${process.env.NEXT_PUBLIC_API_NODE}/api/products`
  );

  return res.data.map((item) => ({
    ...item.products,
    productImages: [item.product_image], // convert single image to array
  }));
};

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithImage | null>(null);

  const itemsPerPage = 8;

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage]);

  const handleDelete = (id: number) => {
    setSelectedProductId(id);
    setOpenDelete(true);
  };

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id) || null;
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  if (loading) return <p className="text-center p-4">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mt-5">
        <Button onClick={() => setOpen(true)}>เพิ่มสินค้า</Button>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>ราคา</TableHead>
            <TableHead>รวม</TableHead>
            <TableHead>ลบ</TableHead>
            <TableHead>แก้ไข</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedProducts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.productName}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{(+p.price * p.stock).toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(p.id)}>ลบ</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(p.id)}>แก้ไข</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
      <AddProductForm
        open={open}
        onOpenChange={setOpen}
        onSuccess={loadProducts}
      />
      <AlertDialogDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        productId={selectedProductId}
        onSuccess={loadProducts}
      />
      <AddEditForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        product={selectedProduct}
        onSuccess={loadProducts}
      />
    </div>
  );
}
