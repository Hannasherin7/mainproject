const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "name":{type:String,require:true},
        "ComplaintType":{type:String,require:true},
        "PriorityLevel":{type:String,require:true},
        "DateFilled":{type:String,require:true},
        "ContactNo":{type:String,require:true},
        "status":{type:String,require:true,default:"pending"},
        "userid":{type: mongoose.Schema.Types.ObjectId,ref: "agric"}
        
    }
)
let complaintmodel=mongoose.model("complaints",schema);

module.exports=complaintmodel