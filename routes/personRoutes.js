import express from 'express';
import { Person } from '../models/Person.js';

const router = express.Router();


// Post route to add a person
router.post("/", async (req, res) => {
  try {
    const data = req.body; // Assuming the request bdy contains the person data

    // Create a new Person documen using the Mongoose model
    const newPerson = new Person(data);
    //   newPerson.name = data.name;
    //   newPerson.work = data.work;
    //   newPerson.age = data.age;
    //   newPerson.mobile = data.mobile;
    //   newPerson.email = data.email;
    //   newPerson.salary = data.salary;

    // Save the new person to the database
    const response = await newPerson.save();
    console.log("Data Saved");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET method to get the person
router.get("/", async (req, res) => {
  try {
    const response = await Person.find();
    console.log("Data Fetched Successfully");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:workType", async (req, res) => {
    try {
      const workType = req.params.workType; // Extract the work type from the URL parameter
      if (
        workType === "chef" ||
        workType === "manager" ||
        workType === "waiter"
      ) {
        const response = await Person.find({ work: workType });
        console.log("Response fetched");
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: "Invalid work type" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.put('/:id', async(req, res) => {
    try{
        const personId = req.params.id; //Extract the id from the URL parameter
        const updatedPersonData = req.body; // Updated data from the person

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }

        console.log("Data Updated");
        res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  })

  router.delete('/:id', async(req,res) => {
    try{
        const personId = req.params.id; //Extract the id from the URL parameter

        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
        console.log("Data Deleted");
        res.status(200).json({message: 'Person Deleted Successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  })


  export default router;