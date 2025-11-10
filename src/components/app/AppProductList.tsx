"use client";

import { useState } from "react";
import Image from "next/image";
import { AppCartBtn } from "./AppCartBtn";
import { id } from "zod/v4/locales";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface ProductListProps {
  products: Product[];
}

const products: Product[] = [
  {
    id: 1,
    name: "ไอศกรีมวานิลลา",
    price: 59,
    stock: 10,
    image: "1.jpg",
  },
];

export default function AppProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // แบ่งหน้า
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {paginatedProducts.map((p) => (
          <div
            key={p.id}
            className="border p-2 rounded shadow hover:shadow-lg transition-shadow duration-200 relative"
          >
            {p.stock === 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                หมดสต็อก
              </span>
            )}
            <Image
              src={`/uploads/${p.image}`}
              alt={p.name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: 150 }}
              unoptimized
              priority
            />
            <p className="font-bold text-gray-800">{p.name}</p>
            <p className="text-gray-600">{p.price} บาท</p>
            <p className="text-gray-600">คงเหลือ {p.stock}</p>
            <AppCartBtn product={products} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
