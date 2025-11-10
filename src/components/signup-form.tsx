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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

const SignUpForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
              <Button type="submit" className="mt-4 w-full">
                สมัครสมาชิก
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
