import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.config";
import {
  UserRegisterData,
  UserLoginData,
  AuthResponse,
} from "../types/auth.types";

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "4d";

export const AuthService = {
  async register(userData: UserRegisterData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        full_name: userData.full_name,
        phone: userData.phone,
        roles: {
          create: [
            {
              role: userData.role ?? "CUSTOMER", // Si no se envía, asume CUSTOMER
              permissions: {},
            },
          ],
        },
      },
      include: { roles: true },
    });

    return this.generateAuthResponse(user);
  },

  async login(loginData: UserLoginData): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
      include: { roles: true },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    return this.generateAuthResponse(user);
  },

  generateAuthResponse(user: any): AuthResponse {
    const roles = user.roles.map((r: any) => r.role);
    const token = jwt.sign(
      { id: user.id, email: user.email, roles },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        roles,
      },
    };
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          select: {
            role: true,
            permissions: true
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Remover campos sensibles
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (!decoded || !decoded.id) {
        throw new Error("Invalid token");
      }
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      }
      throw new Error("Invalid token");
    }
  },
};
