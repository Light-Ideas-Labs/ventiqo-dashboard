import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { User, UserProfileResponse } from "@/constants/data";

// ── Query keys ──────────────────────────────────────────────────────────
export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  myProfile: () => [...userKeys.all, "my-profile"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const fetchUsers = async (): Promise<User[]> => {
  const data = await apiFetch<any>("/users/get/all/users");
  return (data.users?.data ?? []) as User[];
};

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const data = await apiFetch<any>("/users/my/profile");
  return { success: true, data: data.data };
};

// ── Query hooks ─────────────────────────────────────────────────────────
export const useUsers = () =>
  useQuery({ queryKey: userKeys.list(), queryFn: fetchUsers });

export const useMyProfile = () =>
  useQuery({ queryKey: userKeys.myProfile(), queryFn: fetchUserProfile });
