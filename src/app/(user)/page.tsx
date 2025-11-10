import AppProductList from "@/components/app/AppProductList";
export const products = [
  {
    id: 1,
    name: "ไอศกรีมวานิลลา",
    price: 59,
    stock: 10,
    image: "1.jpg",
  },
  {
    id: 2,
    name: "ไอศกรีมช็อกโกแลต",
    price: 65,
    stock: 5,
    image: "2.jpg",
  },
  {
    id: 3,
    name: "น้ำส้มคั้น",
    price: 45,
    stock: 0,
    image: "3.jpg",
  },
  {
    id: 4,
    name: "คุกกี้ช็อกโกแลตชิพ",
    price: 30,
    stock: 20,
    image: "4.jpg",
  },
  {
    id: 5,
    name: "ไอศกรีมสตรอเบอร์รี่",
    price: 59,
    stock: 8,
    image: "5.jpg",
  },
  {
    id: 6,
    name: "ชาเย็น",
    price: 40,
    stock: 15,
    image: "6.jpg",
  },
  {
    id: 7,
    name: "บราวนี่",
    price: 35,
    stock: 0,
    image: "7.jpg",
  },
  {
    id: 8,
    name: "ไอศกรีมมะม่วง",
    price: 59,
    stock: 12,
    image: "8.jpg",
  },
  {
    id: 9,
    name: "น้ำเปล่า",
    price: 20,
    stock: 50,
    image: "9.jpg",
  },
  {
    id: 10,
    name: "โดนัท",
    price: 25,
    stock: 7,
    image: "10.jpg",
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <AppProductList products={products} />
    </div>
  );
}
