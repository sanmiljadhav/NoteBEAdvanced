const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  user:{  //foreign key 
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'

  },
  title:  { type: String,required:true}, // String is shorthand for {type: String}
  description: {
    type:String,
    required:true,
  },
  tag:{
    type:String,
    default:"General"
  },
  date:{
    type:Date,
    default:Date.now
  }
  
});

const Notes = mongoose.model('Notes', noteSchema); //created a model of Note
//also what we provide in the string will be the collection name

module.exports = Notes