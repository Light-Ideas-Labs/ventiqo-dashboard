"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'; // Import unique-names-generator
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleSignInButton from "@/components/ui/google-auth-button";
import { Form, FormField, FormItem, FormLabel,  FormControl, FormMessage, } from "@/components/ui/form";
import { signUpUser } from "@/state/APIConfig";
import { toast } from "sonner";

// Fun username themes 🕺🎤🎭
const eventWords = ["DJ", "Vibes", "Stage", "Party", "Festival", "Show", "Live", "Spotlight", "Hype", "Crowd", "Gig"];

// Zod schema for form validation
const formSchema = z
  .object({
    first_name: z.string().nonempty("First name is required"),
    last_name: z.string().nonempty("Last name is required"),
    username: z.string().nonempty("Username is required"),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

interface SignupFormInputs {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string; // Added this to match the form field
  country?: string; // Optional since it is automatically added
}

export default function UserSignUpForm() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<string>("");

  const router = useRouter(); // Use Next.js router for redirect

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =  useState<boolean>(false);

  // fetch the user's country using IP info
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://ipinfo.io/json?token=${process.env.IP_TOKEN}`,
        );
        console.log("response", response);
        setCountry(response.data.country);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountry();
  }, []);

  // form setup with React Hook Form and Zod resolver
  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(formSchema),
  });
  
  // 🎭 Generate a fun event-based username
  const generateUsername = (firstName: string, lastName: string) => {
    return uniqueNamesGenerator({
      dictionaries: [eventWords, adjectives, colors, animals], // Include event words
      separator: "_",
      length: 3,
      style: "lowerCase",
    });
  };
  
  // ✨ Automatically generate a username when first or last name changes
  const handleGenerateUsername = () => {
    const firstName = form.getValues("first_name");
    const lastName = form.getValues("last_name");

    if (firstName && lastName) {
      const newUsername = generateUsername(firstName, lastName);
      form.setValue("username", newUsername);
    }
  };

  // form submission handler
  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);
    try {
      // Include country in the data
      const { confirm_password, ...userData } = { ...data, country };
      const response = await signUpUser(userData);
      const token = response.activationToken; // Assume the token is returned from the API

      toast.success("Success", {
        description: response.message,
      });
      // Handle response, redirect, show a message, etc.
      // Redirect to activation page with token
      router.push(`/account-activation?token=${token}`);
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              name="first_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    onBlur={handleGenerateUsername} // Generate username when user leaves the field
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="last_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    {...field}
                    onBlur={handleGenerateUsername} // Generate username when user leaves the field
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username (auto-generated 🎭)</FormLabel>
                <FormControl>
                  <Input placeholder="Your unique username" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirm_password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password and Sign Up Links */}
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-primary"
            >
              Forgot Password?
            </Link>
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Already have an account? Sign In
            </Link>
          </div>

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
