const agrimodel = require('../models/agri')

const viewsign = async (req, res) => {
    agrimodel.find().then((data) => {
        res.json(data);
    }).catch((error) => {
        console.error("Error fetching data", error);
        res.status(500).json({ "status": "error", "message": "Internal Server Error" });
    });
}


const getUserDetails = async (req, res) => {
    const email = req.query.email;
    // Fetch user from database using email
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Server error' });
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.send(user);
    });
}

// Delete user by ID
const deleteuserid = async(req, res) => {
    const userId = req.params.id; // Get user ID from request parameters

    agrimodel.findByIdAndDelete(userId)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
            }
            res.json({
                status: "success",
                message: "User deleted successfully",
            });
        })
        .catch((error) => {
            console.error("Error deleting user", error);
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        });
}

const deleteuser = async  (req, res) => {
    let input = req.body;
    console.log("Received delete request for ID:", input._id); // Log the received ID
    agrimodel.findByIdAndDelete(input._id)
        .then((response) => {
            if (response) {
                res.json({ "status": "success" });
            } else {
                console.error("User not found with ID:", input._id); // Log if user not found
                res.json({ "status": "error", message: "User not found" });
            }
        })
        .catch((error) => {
            console.error("Error deleting user:", error); // Log the error
            res.json({ "status": "error", message: error.message }); // Return the error message
        });
}

module.exports = {
    viewsign,
    getUserDetails,
    deleteuserid,
    deleteuser
}
