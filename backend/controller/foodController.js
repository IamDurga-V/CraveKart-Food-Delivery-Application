import fs from "fs";
import foodModel from "../models/foodModel.js";

//Add Food Items
const addFood = async (req, res) => {
  let image_filename = req.file.filename;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: image_filename,
    category: req.body.category,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Display Food List
const displayFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Update Food Item
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category } = req.body;
    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      food.image = req.file.filename;
    }
    food.name = name;
    food.description = description;
    food.price = price;
    food.category = category;
    await food.save();
    res.json({ success: true, message: "Food Item Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Remove Food Item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, displayFood, removeFood, updateFood };
