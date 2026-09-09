import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { apiFetch } from "@/lib/api-client";

interface dataSignInUser {
  email: string;
  password: string;
}

interface SignInResponse {
  ok?: boolean;
  error?: string;
  status?: number;
  [key: string]: any;
}

interface dataSignUpUser {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

// ── Fetchers ────────────────────────────────────────────────────────────
// Sign-in goes through NextAuth's credentials provider (which itself calls
// the backend's /auth/sign-in), not a direct backend call — see auth.config.ts.
export const signInUser = async (userDetails: dataSignInUser): Promise<SignInResponse> => {
  const res = await signIn("credentials", {
    redirect: false,
    email: userDetails.email,
    password: userDetails.password,
  });

  if (res?.ok) {
    return res as SignInResponse;
  }

  throw new Error(res?.error || "Unknown error occurred");
};

export const signUpUser = (userDetails: dataSignUpUser) =>
  apiFetch<any>("/auth/sign-up", { method: "POST", body: userDetails, auth: false });

export const activateAccount = (activationDetails: { activation_code: string; activation_token: string | null }) =>
  apiFetch<any>("/auth/activate-user-account", { method: "POST", body: activationDetails, auth: false });

export const forgotPassword = (email: string) =>
  apiFetch<any>("/auth/forgot-password-link", { method: "POST", body: { email }, auth: false });

export const resetPassword = (token: string, newPassword: string) =>
  apiFetch<any>(`/auth/new-password/${token}`, { method: "POST", body: { password: newPassword }, auth: false });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useSignIn = () => useMutation({ mutationFn: signInUser });

export const useSignUp = () => useMutation({ mutationFn: signUpUser });

export const useActivateAccount = () => useMutation({ mutationFn: activateAccount });

export const useForgotPassword = () => useMutation({ mutationFn: forgotPassword });

export const useResetPassword = () =>
  useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      resetPassword(token, newPassword),
  });
