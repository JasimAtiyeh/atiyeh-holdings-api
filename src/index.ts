import app from "./app";
import { connectDB } from "./database";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})();
