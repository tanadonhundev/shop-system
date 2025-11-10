"use client";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AppLogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  };

  return (
    <>
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-400 cursor-pointer"
      >
        Log out
      </Button>
    </>
  );
};

export default AppLogoutButton;
