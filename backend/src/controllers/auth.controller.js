import { generateJWT } from "../lib/utils.js";
import BlacklistedToken from "../models/blacklistToken.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * @name signupUser
 * @desc Register a new user
 * @route POST /api/auth/signup
 * @access Public
 * @param req
 * @param res
 */
export const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //checking if user with the same email/username already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ message: "This username is already taken" });
      }
      return res
        .status(400)
        .json({ message: "Account with this email already exist" });
    }

    //hashing the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //generating jsonwebtoken for authorization
    const token = generateJWT(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name loginUser
 * @desc login the user
 * @route GET /api/auth/login
 * @access Public
 * @param req
 * @param res
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    //finding user in the database
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });

    //comparing the password with hashedPassword
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.json(401).json({ message: "Email or password is wrong" });

    const token = generateJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({
      message: "User loggedIn successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name checkAuthUser
 * @desc checking if the user is authenticated
 * @route GET /api/auth/check-auth
 * @access Authorized only
 * @param req
 * @param res
 */
export const checkAuthUser = async (req, res) => {
  try {
    const user = req?.user;

    const foundUser = await User.findById(user.id);

    if (!foundUser)
      return res.status(401).json({ message: "User does not exist" });

    return res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    console.error("Error during check-auth:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name logoutUser
 * @desc logout the user
 * @route GET /api/auth/logout
 * @access Authorized only
 * @param req
 * @param res
 */
export const logoutUser = async (req, res) => {
  try {
    const user = req?.user;
    const { token } = req.cookies;

    //finding user in the database
    const foundUser = await User.findById(user.id);

    if (!foundUser)
      return res.status(404).json({ message: "User does not exist" });

    //deleting token cookie
    res.clearCookie("token");
    await BlacklistedToken.create({ token });

    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name deleteUser
 * @desc delete the Account of the user
 * @route DELETE /api/auth/delete
 * @access Authorized only
 * @param req
 * @param res
 */
export const deleteUser = async (req, res) => {
  try {
    const user = req?.user;
    const { token } = req.cookies;

    const foundUser = await User.findByIdAndDelete(user.id);

    if (!foundUser)
      return res.status(401).json({ message: "User does not exist" });

    await BlacklistedToken.create({ token });
    return res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
};
