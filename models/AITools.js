const mongoose = require("mongoose");


// Friends Ledger Schema
const aITools = mongoose.Schema({
    UID:{
        type: String,
        required: true,
        trim:true
    },
    CategoryID :{
        type: String,
        required: true,
        trim:true
    },
    Name:{
        type: String,
        trim:true
    },
    Description:{
        type: String,
        trim:true
    },
    Thumbnail:{
        type: String,
        // required: true,
        trim:true
    },
    Pricing:{
        type: String,
        required: true,
        trim:true
    },
    WebsiteURL:{
        type: String,
        trim:true,
        default: null
    },
    DocumentationURL:{
        type: String,
        trim:true,
        default: null
    },
    pricing_url:{
        type: String,
        trim:true,
        default: null
    },
    developed_in:{
        type: String,
        trim:true,
        // default: null
    },
    developed_for:{
        type: String,
        trim:true,
        // default: null
    },

    CreatedAt: {
        type: String,
        default: new Date().toLocaleString(),
      }
},{
    timestamps: { currentTime: ()=> Date.now() },  
})

const AITools = mongoose.model("AITOOLS", aITools);

// exporting modules
module.exports = AITools;