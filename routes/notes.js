const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/validateToken/validatetoken");
const Notes = require("../models/Notes");
const { validateNote } = require("../middlewares/validation/Note");
const { validationResult } = require("express-validator");
const { findById } = require("../models/User");
const  ObjectID = require('mongodb').ObjectId;
const mongoose = require('mongoose');


//Get All the Notes of the logged in user using: GET "/api/notes/fetchallnotes"
//require auth(login required)
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error')
    
  }
 
});

//Add note for logged in user using: POST "/api/notes/addnote"
//require auth(login required)
router.post("/addnote", fetchUser, validateNote, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    }); //returns promise

    const savedNote = await note.save();

    res.json(savedNote);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal Server Error')
  }
});


//Update an existing note using: PUT "/api/notes/updatenote/:id"
//require auth(login required)
router.put("/updatenote/:id", fetchUser, validateNote, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('BOOL',mongoose.Types.ObjectId.isValid(req.params.id))

      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send('Not a valid Note Id');


      }

      let note = await Notes.findById(req.params.id,);
      

      //Kya yahi user hai jiska ye note hai
      if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed to update Note")
      }

      const {title,description,tag} = req.body;
  
      // create a newNote object
      const newNote = {};

      if(title){newNote.title = title};
      if(description){newNote.description = description};
      if(tag){newNote.tag = tag};
      console.log('NEW NOTE OBJ IS',newNote)
      
      //Find the NoteId from the Database and update that note
      let updatednote = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
      console.log('operation done')
     
      return res.status(200).json("Note has been updated") 
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error')
    }
  });


//Delete an existing note using: DELETE "/api/notes/deletenote/:id"
//require auth(login required)
router.delete("/deletenote/:id", fetchUser, validateNote, async (req, res) => {
    try {

      if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send('Not a valid Note Id');
      }

      let note = await Notes.findById(req.params.id,);
      if(note == null){
        return res.status(404).send('Note Id not found')
      }
      console.log('note is',note)
      
      //Kya yahi user hai jiska ye note hai
      if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed to delete the Note")
      }     
      //Find the NoteId from the Database and delete that note
      //Allow deletion only if user owns this note
      let deletednote = await Notes.findByIdAndDelete(req.params.id)
      console.log('operation done')
     
      return res.status(200).json("Note has been deleted") 
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error')
    }
  });


module.exports = router;
