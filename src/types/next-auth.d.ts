import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      first_name?: string;
      last_name?: string;
      username?: string;
      phone_number?: string;
      role?: string;
      isPaid?: boolean;
      nextPaymentAmount?: number;
      nextPaymentDate?: string;
       // Add your custom properties here
    };
  }

  interface User {
    id: string;
    role?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    // Add your custom properties here
  }
}
