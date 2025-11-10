import { K2D } from "next/font/google";

const k2d = K2D({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-k2d",
});

export { k2d };
