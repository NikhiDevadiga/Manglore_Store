import mongoose from "mongoose";
import Cat from "../Model/categoryModel.js"

export const createCat = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
          }
        const cat = new Cat({
          name: req.body.name,
          image: req.file.path, // optional chaining
        });
        await cat.save();
        res.status(201).json({success:true, data:cat });
    }catch(error){
        console.error("Error in create Caregory:", error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }
};

export const getCat =  async(req,res) => {
    try{
        const cat = await Cat.find().select('name image');
        res.status(200).json({success: true, data: cat });
    }catch(error){
        console.error("Error in fetching Category:", error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }
};

export const updateCat = async (req, res) => {
    try {
      const catId = req.params.id;
      // Check if cat exists
      const existingCat = await Cat.findById(catId);
      if (!existingCat) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      // Update fields
      if (req.body.name) existingCat.name = req.body.name;
      if (req.file) existingCat.image = req.file.path;
      
      await existingCat.save();
      res.status(200).json({ success: true, data: existingCat });
    } catch (error) {
      console.error("Error updating Category:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

export const deleteCat = async(req,res) => {
    const {id} = req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success:false, message: "Invalid Category id"})
    }
   try{
    await Cat.findByIdAndDelete(id);
    res.status(200).json({success:true, message:"Category Deleted"});
   }catch(error){
    console.error("Error in delete Category:", error.message);
        res.status(500).json({success:false, message: "Server Error"});
   }
};
