
const express = require('express')
const authController = require("../controller/auth")
const comController = require("../controller/complaint")

const router = express.Router()



router.get('/',(req,res)=>res.send('gjgjg'))

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/addcom',comController.addcom)
router.get('/viewcom',comController.viewcom)






module.exports = router