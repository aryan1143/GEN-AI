import { Schema, model } from "mongoose";

const blacklistedToken = new Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to add in the blacklist"],
    },
  },
  { timestamps: true },
);

const BlacklistedToken = model("BlacklistedToken", blacklistedToken);

export default BlacklistedToken;
