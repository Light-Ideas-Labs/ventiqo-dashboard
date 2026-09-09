import { HTMLAttributes, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { activateAccount } from "@/state/APIConfig";

interface ActivationFormInputs {
  activation_code: string;
}

// Zod schema for form validation
const formSchema = z.object({
  activation_code: z
    .string()
    .min(1, { message: "Please enter your Activation code." }),
});

export function AccountActivationForm({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const router = useRouter(); // Use Next.js router for redirect
  const [loading, setLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const searchParams = useSearchParams(); // Hook to access the search parameters
  const token = searchParams.get("token"); // Get the 'token' from the URL

  const form = useForm<ActivationFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: { activation_code: "" },
  });

  const onSubmit = async (data: ActivationFormInputs) => {
    setLoading(true);
    try {
      // Send activation details to backend
      const response = await activateAccount({
        activation_code: data.activation_code,
        activation_token: token,
      });

      if (response?.success) {
        toast.success("Activation Successful", {
          description: response.message,
        });
        // Redirect to siginin page or handle success case
      } else {
        toast.error("Error", {
          description:
            response.message || "Activation failed. Please try again.",
        });
      }
      // Redirect to the next page or handle further actions
      router.push(`/sign-in`);
    } catch (error) {
      console.error("Error during activation:", error);
      toast.error("Error", {
        description: "Activation failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="activation_code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-1">
                <FormControl>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    onChange={(value) => {
                      field.onChange(value);
                      setDisabledBtn(value.length !== 6);
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Activating..." : "Activate Account"}
        </Button>
      </form>
    </Form>
  );
}
