import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ComponentProps } from "react";

interface NavMenuProps extends ComponentProps<typeof NavigationMenu> {
  role?: string; 
}

export const NavMenu = ({ role, ...props }: NavMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/">สินค้าทั้งหมด</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* แสดงเฉพาะ admin */}
      {role === "admin" && (
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/product">จัดการสินค้า</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
    </NavigationMenuList>
  </NavigationMenu>
);
