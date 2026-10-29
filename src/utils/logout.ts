// src/utils/logout.ts

import { signOut } from "next-auth/react";

export const handleLogout = async () => {
  await signOut({ callbackUrl: "/sign-in" });
};
