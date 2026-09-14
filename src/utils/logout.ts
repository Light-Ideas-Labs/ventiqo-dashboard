// src/utils/logout.ts

import { signOut } from "next-auth/react";

export const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Successfully logged out
      await signOut({ callbackUrl: '/auth/signin' }); // Redirect to signin page
    } else {
      console.error("Failed to log out:", await response.json());
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
