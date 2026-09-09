export interface dataSignInUser {
  email: string;
  password: string;
}

export interface dataSignUpUser {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface jwtTokenDecode {
  user: {
    id: string;
    email: string;
    role: string;
  };
  iat: number;
  exp: number;
}
