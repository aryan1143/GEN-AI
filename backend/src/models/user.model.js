import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "This username is already taken"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Account with this email already exist"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
