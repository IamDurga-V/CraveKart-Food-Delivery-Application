import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

//App Configuration
const app = express();
const port = 4000;

//MiddleWare
app.use(express.json());
app.use(cors());

//DB Connection
connectDB();

//API EndPoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.get("/", (req, res) => {
  res.send("API Working");
});
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

//mongodb+srv://DurgaV:Durga482004@cluster0.afxxv97.mongodb.net/?
