import app from "./src/app.js";
import { config } from "dotenv";
import connectToDB from "./src/config/database.js";

config();

const PORT = process.env.PORT || 3000;

connectToDB();
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
