import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      first_name?: string;
      last_name?: string;
      username?: string;
      role?: string; 
       // Add your custom properties here
    };
  }

  interface User {
    role?: string;  
    username?: string;
    first_name?: string;
    last_name?: string;
    // Add your custom properties here
  }
}
