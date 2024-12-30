import express from "express";
import { MenuItem } from "../models/MenuItem.js";

const router = express.Router();


// Post route to add menu
router.post("/", async (req, res) => {
  try {
    const menuItemData = req.body; // Assuming the request bdy contains the person data

    // Create a new Person documen using the Mongoose model
    const menuItem = new MenuItem(menuItemData);

    // Save the new person to the database
    const response = await menuItem.save();
    console.log("Data Saved");
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET method to get all the menu items
router.get("/", async (req, res) => {
  try {
    const response = await MenuItem.find();
    console.log("Menu Items Fetched Successfully");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error fetchig menu items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:tasteType", async (req, res) => {
  try {
     const tasteType = req.params.tasteType; // Extract the taste from the URL parameter
     if(tasteType === 'Sweet' ||
        tasteType === 'Spicy' || 
        tasteType === 'Sour'
     ){
        const response = await MenuItem.find({taste: tasteType});
        console.log("Response fetched");
        res.status(200).json(response);
     }else{
        res.status(404).json({error: "Invalid work type"});
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
    
  }
});

router.put('/:id', async(req, res) => {
    try{
        const menuId = req.params.id;
        const updatedMenuData = req.body;
        
        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData,{
            new: true,
            runValidators: true,
        })

        if(!response){
            return res.status(404).json({error: 'Menu Item not found'});
        }
        console.log("Menu Item Updated");
        res.status(200).json(response);
        
    }catch(error){
       console.log(error);
       res.status(500).json({error: "Internal Server Error"});
       
    }
})

router.delete('/:id', async(req, res) => {
    try{
         const menuId = req.params.id;

         const response  = await MenuItem.findByIdAndDelete(menuId);

         if(!response){
            return res.status(404).json({error: 'Menu Item not found'});
         }
         console.log("Data Deleted");
         res.status(200).json({message: 'MenuItem Deleted Successfully'});
         
    }catch(error){
         console.log(error);
         res.status(500).json({error: 'Internal Server Error'});
         
    }
})

export default router;
