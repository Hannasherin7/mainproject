const complaintmodel =require("../models/complaint");

// POST route to add complaints
const addcom = async (req, res) => {
    const { complaint } = req.body; // Only extract complaint

    // Validate input
    if (!complaint) {
        return res.status(400).json({ status: "error", message: "Complaint is required" });
    }

    // Create a new complaint document
    const newComplaint = new complaintmodel({
        complaint: complaint,
        // Removed datec from the document
    });

    // Save the complaint to the database
    newComplaint.save()
        .then(() => {
            res.json({ status: "success", message: "Complaint registered successfully" });
        })
        .catch((error) => {
            console.error("Error saving complaint:", error);
            res.status(500).json({ status: "error", message: "Failed to register complaint" });
        });
}



const viewcom = async (req,res)=>{
    complaintmodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
}

module.exports = {
    addcom,
    viewcom
}