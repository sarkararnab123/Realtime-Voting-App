const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    votes:{
        type:Number,
        default:0
    }
})

const PollSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    options:{
        type:[optionSchema],
        validate:{
            validator:(v)=> v.length>=2 && v.length<=6,
            message:"A poll must have between 2 to 6 options"
        }
    },
    totalVotes:{
        type:Number,
        default:0
    },
},{timestamps:true})

const Poll = new mongoose.model("Poll",PollSchema);
exports.default = Poll;