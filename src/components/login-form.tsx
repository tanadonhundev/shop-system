"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "ป้อนข้อมูลอีเมลด้วย" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
    .trim(),
  password: z.string().min(4, { message: "รหัสผ่านต้องมี 4 ตัวขึ้นไป" }).trim(),
});

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success", ctx.data);
          // get session (client side)
          const { data: session } = await authClient.getSession();
          if (session?.user.role === "admin") {
            router.replace("/product");
          } else if (session?.user.role === "user") {
            router.replace("/");
          }
          // router.replace("/");
          toast.success("เข้าสู่ระบบสำเร็จ");
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-3xl">
      <div className="relative max-w-sm w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl bg-linear-to-b from-muted/50 dark:from-transparent to-card overflow-hidden">
        <div className="relative isolate flex flex-col items-center">
          <p className="mt-4 text-3xl font-semibold tracking-tight">
            เข้าสู่ระบบ
          </p>
          <Form {...form}>
            <form
              className="w-full space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                เข้าสู่ระบบ
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <Link
              href="/"
              className="text-sm block underline text-muted-foreground text-center"
            >
              กลับสู่หน้าหลัก
            </Link>
            <p className="text-sm text-center">
              ยังไม่ได้เป็นสมาชิก?
              <Link
                href="/singup"
                className="ml-1 underline text-muted-foreground"
              >
                สมัครสามาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
