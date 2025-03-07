const { verifytoken } = require("../helper/index")

const adminRequird = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")?.[1]
        const decodedData = await verifytoken(token)
        if (!decodedData?.isAdmin) return res.json({ messge: "You don't have access to this resources" })
        next()
    } catch (error) {
        res.json({ messge: "You don't have access to this resources" })
    }
}



// const loginRequird = async(req, res, next) => {  
//     try {
//         const token = req?.headers?.authorization?.split(" ")?.[1]
//         const decodedData = await verifytoken(token)
//         req.user = decodedData?.email;
//         next();
//     } catch (error) {
//         console.log('Token verification failed:', error);
//         res.status(403).json({ error: 'Invalid token' });
//     }
// };
const loginRequird = async (req, res, next) => {  
    try {
        const token = req?.headers?.authorization?.split(" ")?.[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedData = await verifytoken(token);
        console.log('Decoded Token:', decodedData); // Debugging

        // Attach the full user object, including ID and email
        req.user = {
            id: decodedData?.id,
            email: decodedData?.email,
            isAdmin: decodedData?.isAdmin
        };

        next();
    } catch (error) {
        console.log('Token verification failed:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};


module.exports = {
    adminRequird,
    loginRequird
}