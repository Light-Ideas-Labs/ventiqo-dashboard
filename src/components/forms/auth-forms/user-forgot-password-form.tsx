"use client";

import { HTMLAttributes, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPassword } from "@/state/APIConfig";
import { Button } from "@/components/ui/button";
import { Form, FormControl,  FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Validation schema using zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

// Define the form values type
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function UserForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      console.log("Sending email to reset password:", data.email);

      const response = await forgotPassword(data.email);
      const token = response.token

      console.log("Password reset email sent successfully. Response:", response)

      toast.success("Success", {
        description: response.message,
      });

      router.push(`/reset-password?token=${token}`);
    } catch (error) {
      console.error("Error sending reset link:", error)
      toast.error("Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}
