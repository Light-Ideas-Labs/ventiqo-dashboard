"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import UserResetPasswordForm from "@/components/forms/auth-forms/user-reset-password-form";

export default function ResetPassword() {
  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex h-full flex-col overflow-hidden bg-muted p-10 text-white dark:border-r">
          <div className="relative z-20 flex items-center text-lg font-medium">
            {/* Logo Section */}
            <Link href="/" aria-label="Go to Home">
            <Image
              src={"/images/logo/ventiqo-white-logo.svg"}
              alt="Ventiqo Logo"
              width={40}
              height={40}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            </Link>
          </div>
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 z-10 bg-[#45769E] opacity-70"></div>
                    <Image
                      src={"/images/overlays/login-overlay.png"} // Replace with the path to your uploaded image
                      alt="Background Image"
                      fill
                      className="z-0 object-cover"
                    />
                  </div>

                  <div className="relative z-30 flex flex-1 flex-col items-center justify-center px-10 text-center">
                  <h2 className="sm:text-title-xl2 text-2xl font-bold text-white">
              Ready to dive back in?
            </h2>

            <p className="mt-4 tracking-tight text-white 2xl:px-20">
              Secure your account and continue exploring your favorite events.
              Your next great experience is just a step away.
            </p>
          </div>
        </div>
        <div className="flex h-full items-center p-4 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Please choose your password
              </p>
            </div>
            <UserResetPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
