import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://DurgaV:Durga482004@cluster0.afxxv97.mongodb.net/CraveKart",
    )
    .then(() => console.log("MongoDB DataBase Connected"));
};
