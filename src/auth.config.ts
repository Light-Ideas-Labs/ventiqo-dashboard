import { NextAuthOptions } from 'next-auth';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from "next-auth/providers/facebook";
import { VentiqoBackendAPI } from "@/constants/ventiqo-backend-api";

// Interface for AuthResponse
interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    loginDomain: string;
    entity: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    age: string;
    gender: string;
    preferred_language: string;
    country: string;
    role: string;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
    isVerified: boolean;
    isAdmin: boolean;
    isPaid: boolean;
    nextPaymentAmount: number;
    resetVerified: boolean;
    isSuspended: boolean;
    profileState: string;
    preferences: any[];
    eventsBooked: any[];
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
    schemaVersion: number;
    nextPaymentDate: string;
    history: any[];
    deletedAt: string;
    id: string;
  };
}

// Function to check if the token is expired
const isTokenExpired = (token: string | undefined): boolean => {
  if (!token) return true;
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// Helper function to refresh access token
async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const response = await fetch(`${VentiqoBackendAPI}/auth/refresh-token`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    console.log(`Refresh token response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    console.log("New tokens received:", data);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? '',
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const response = await fetch(`${VentiqoBackendAPI}/auth/sign-in`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Authentication error:", errorData);
            throw new Error(errorData.message || 'Authentication failed');
          }

          const data: AuthResponse = await response.json();
          console.log("User logged in successfully:", data);

          if (data.success && data.user) {
            return {
              ...data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          } else {
            throw new Error('Authentication failed');
          }
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || 'Internal server error');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || "",
      clientSecret: process.env.FACEBOOK_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = {
          ...user,
          email: user.email,
          fullname: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          phone_number: user.phone_number,
          role: user.role,
        };
        console.log("JWT Callback: new token generated", token);
      } else {
        console.log("JWT Callback: existing token", token);

        // Check if the token is expired
        if (isTokenExpired(token.accessToken) && token.refreshToken) {
          console.log("JWT Callback: token expired, refreshing...");
          try {
            const refreshedToken = await refreshAccessToken();
            token.accessToken = refreshedToken.accessToken;
            token.refreshToken = refreshedToken.refreshToken || token.refreshToken;
            console.log("JWT Callback: token refreshed", token);
          } catch (error) {
            console.error("JWT Callback: token refresh failed", error);
            token.error = "RefreshTokenError";
          }
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      session.user.id = token.sub; // Include the user.id in the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      console.log("Session Callback: updated session", session);
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      try {
        console.log('Sign-out event triggered:', token);

        // Ensure token or session details are passed correctly
        const accessToken = token?.accessToken;

        if (!accessToken) {
          console.error('No access token found for signing out.');
          return;
        }

        // Call backend signOut API to invalidate tokens
        const response = await fetch(`${VentiqoBackendAPI}/auth/sign-out`, {
          method: 'POST',
          credentials: 'include', // Include cookies for server-side logout
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Send access token if needed
          },
        });

        if (!response.ok) {
          console.error('Failed to sign out on the server:', response.status, response.statusText);
        } else {
          console.log('Successfully signed out on the server');

          // Optionally, clear client-side session
          await nextAuthSignOut({ redirect: false });
        }
      } catch (error) {
        console.error('Error during sign-out event:', error);
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "your_generated_secret",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/account-activation",
  },
};

export default authConfig;
