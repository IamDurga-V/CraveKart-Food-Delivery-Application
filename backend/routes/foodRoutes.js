import express from "express";
import {
  addFood,
  displayFood,
  removeFood,
  updateFood,
} from "../controller/foodController.js";
import multer from "multer";
const foodRouter = express.Router();

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/display", displayFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/update", upload.single("image"), updateFood);

export default foodRouter;
