"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserSignUpForm from "@/components/forms/auth-forms/user-signup-form"


const SignUp: React.FC = () => {
  
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative flex h-full flex-col overflow-hidden bg-muted p-10 text-white dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src={"/images/logo/ventiqo-white-logo.svg"}
            alt="Ventiqo Logo"
            width={40}
            height={40}
          />
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
          Join a world of extraordinary experiences!
          </h2>

          <p className="mt-4 text-white 2xl:px-20 tracking-tight">
          Sign up to unlock a universe of events tailored just for you.
          </p>
        </div>

        {/* Triangle overlay graphics */}
        <div className="absolute bottom-0 left-0 z-20">
          <Image
            src={"/images/overlays/bottom-triangle-overlay.png"} // Replace with the path to your uploaded triangle image
            alt="Overlay Graphic 1"
            width={800}
            height={700}
          />
        </div>
        <div className="absolute right-[-40px] top-0 z-20">
          <Image
            src={"/images/overlays/top-triangle-overlay.png"} // Replace with the path to your uploaded triangle image
            alt="Overlay Graphic 2"
            width={450}
            height={450}
          />
        </div>
      </div>


            {/* Right side of the login page */}
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          < UserSignUpForm/>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>


  );
};

export default SignUp;
