export type UserRegisterData = {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'VENDOR' | 'DESIGNER';
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    roles: string[];
  };
};
