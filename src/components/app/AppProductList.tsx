"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { AppCartBtn } from "./AppCartBtn";
import axios from "axios";

type Product = {
  id: number;
  productName: string;
  price: string; // API ส่งมาเป็น string
  stock: number;
  createdAt: string;
};

type ProductImage = {
  id: number;
  productId: number;
  imageName: string;
  createdAt: string | null;
};

// ประเภทข้อมูลที่ API ส่งมา
type ApiProductResponse = {
  products: Product;
  product_image: ProductImage;
};

// ประเภทข้อมูลที่จะใช้ใน component
type ProductWithImage = Product & {
  productImages: ProductImage[];
};

export default function AppProductList() {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiProductResponse[]>(`${process.env.NEXT_PUBLIC_API_NODE}/api/products`);

        // แปลงข้อมูลให้เป็น array ของ ProductWithImage
        const mappedProducts: ProductWithImage[] = res.data.map((item) => ({
          ...item.products,
          productImages: [item.product_image],
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.slice(start, end);
  }, [products, currentPage]);

  if (loading) return <p className="text-center p-4">Loading products...</p>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="border p-2 rounded shadow hover:shadow-lg transition-shadow duration-200 relative"
          >
            {product.stock === 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                หมดสต็อก
              </span>
            )}

            {product.productImages[0] && (
              <Image
                src={`/uploads/${product.productImages[0].imageName}`}
                alt={product.productImages[0].imageName}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: 150 }}
                unoptimized
                priority
              />
            )}

            <p className="font-bold text-gray-800">{product.productName}</p>
            <p className="text-gray-600">{product.price} บาท</p>
            <p className="text-gray-600">คงเหลือ {product.stock}</p>
            <AppCartBtn product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
