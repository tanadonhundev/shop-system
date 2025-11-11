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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "ป้อนข้อมูลชื่อด้วย" }),
  email: z
    .string()
    .min(1, { message: "ป้อนข้อมูลอีเมลด้วย" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
    .trim(),
  password: z.string().min(4, { message: "รหัสผ่านต้องมี 4 ตัวขึ้นไป" }).trim(),
});

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: () => {
          //redirect to the dashboard or sign in page
          router.replace("/login");
          toast.success("สมัครสมาชิกสำเร็จ");
        },
        onError: (ctx) => {
          // display the error message
          toast.error(ctx.error.message);
        },
        onFinally: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-3xl">
      <div className="relative max-w-sm w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl bg-linear-to-b from-muted/50 dark:from-transparent to-card overflow-hidden">
        <div className="relative isolate flex flex-col items-center">
          <p className="mt-4 text-3xl font-semibold tracking-tight">
            สมัครสมาชิก
          </p>

          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="name"
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

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
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
              เป็นสมาชิกแล้ว?
              <Link
                href="/login"
                className="ml-1 underline text-muted-foreground"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
