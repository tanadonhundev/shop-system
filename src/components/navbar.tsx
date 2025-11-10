import { Button } from "@/components/ui/button";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { AppCartTotal } from "./app/AppCartTotal";

const Navbar = () => {
  return (
    <nav className="h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-12">
          Logo
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/cart"}>
            <div className="flex gap-1 p-1 border border-black rounded-sm">
              <ShoppingCart className="h-5 w-5" />
              <AppCartTotal />
            </div>
          </Link>
          <Button variant="outline">
            <Link href={"/login"}>เข้าสู่ระบบ</Link>
          </Button>
          <Button>
            <Link href={"/singup"}>สมัครสามาชิก</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
