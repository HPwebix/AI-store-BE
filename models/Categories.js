const mongoose = require("mongoose");


// Friends Ledger Schema
const categories = mongoose.Schema({

    Name:{
        type: String,
        trim:true
    },
    Description:{
        type: String,
        trim:true
    },
    ParentCategoryID :{
        type: String,
        trim:true,
        default: null
    },

    CreatedAt: {
        type: String,
        default: new Date().toLocaleString(),
      }
},{
    timestamps: { currentTime: ()=> Date.now() },  
})

const Categories = mongoose.model("CATEGORIES", categories);

// exporting modules
module.exports = Categories;