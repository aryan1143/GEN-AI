import { Router } from "express";
import { protectRoute } from "../lib/middlewares.js";
import {
  checkAuthUser,
  deleteUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", signupUser);

/**
 * @route GET /api/auth/login
 * @desc Login an existing user
 * @access Public
 */
router.get("/login", loginUser);

/**
 * @route GET /api/auth/check-auth
 * @desc Check if the user is authenticated
 * @access Private
 */
router.get("/check-auth", protectRoute, checkAuthUser);

/**
 * @route GET /api/auth/logout
 * @desc Logout the user
 * @access Private
 */
router.get("/logout", protectRoute, logoutUser);

/**
 * @route DELETE /api/auth/delete
 * @desc Delete the user's account
 * @access Private
 */
router.delete("/delete", protectRoute, deleteUser);

export default router;
