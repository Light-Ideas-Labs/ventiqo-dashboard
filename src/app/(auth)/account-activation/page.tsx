"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AccountActivationForm } from "@/components/forms/auth-forms/account-activation-form";


export default function AccountActivation() {
  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex h-full flex-col bg-muted p-10 text-white dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
        <Image src={"/images/logo/ventiqo-white-logo.svg"} alt="Ventiqo Logo" width={40} height={40} />
        </div>
          </div>

          <div className="flex h-full items-center p-4 lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-md font-semibold tracking-tight">
                  Account Activation
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please enter the activation code. <br /> We have sent to your email.
                </p>
              </div>
              <AccountActivationForm />
              <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
                Haven&apos;t received it?{" "}
                <Link
                  href="/resend-new-code"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Resend a new code.
                </Link>
                .
              </p>
            </div>
          </div>
      </div>
    </>
  );
}
