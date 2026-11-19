
import { z } from "zod";
import {
  signupUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function signup(req, res) {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid signup data",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const result = await signupUser(parsed.data);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const result = await loginUser(parsed.data);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
}

export async function me(req, res) {
  const user = await getUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    success: true,
    data: { user },
  });
}
