
const express = require('express')
const authController = require("../controller/auth")
const comController = require("../controller/complaint")
const orderController = require("../controller/order")
const productController = require("../controller/product")
const recipeController = require("../controller/recipe")
const tipController = require("../controller/storagetip")
const userController = require("../controller/user")
const farmerController = require("../controller/farmer");
const feedbakController = require("../controller/feedback");
const blogcontroller = require("../controller/blog");
const sellercontroller=require("../controller/seller")
const buyercomplaint=require("../controller/buyercomplaint")
const announcement=require("../controller/Announcement")
const adminActivities=require("../controller/adminactivity")
const contactus=require("../controller/contact")

const multer = require("multer");
const authMiddleware = require('../middeware/auth')
const path = require('path');
const router = express.Router()
router.get('/',(req,res)=>res.send('gjgjg'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileExtension = file.originalname.split('.').pop(); // Get the file extension
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    }
  })
  


const upload = multer({ storage:storage });

// Farmer Routes
router.post('/register-farmer',upload.any(), authMiddleware.loginRequird, farmerController.registerFarmer);
router.get('/farmers', farmerController.getAllFarmers);
router.post('/update-farmer-status', farmerController.updateFarmerStatus);
// router.get('/check-farmer/:email', farmerController.checkFarmerStatus);
router.get('/user/status/:userId', farmerController.checkFarmerStatus);
router.get('/user/check-registration/:userId', farmerController.checkexistence);
// 

//router.post('/submitFeedback',upload.any(), authMiddleware.loginRequird, feedbakController.submitFeedback);
router.post('/user/profile',authMiddleware.loginRequird,userController.userProfile)
router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.post('/complaints',upload.any(), authMiddleware.loginRequird, comController.createComplaint)
router.post('/updateComplaintStatus',comController.updateComplaintStatus)
router.get('/ownComplaint', authMiddleware.loginRequird, comController.getOwnComplaints)
router.get('/complaintList',authMiddleware.loginRequird, comController.getComplaints)
router.post('/deleteComplaint',comController.deleteComplaint)


router.post('/order',authMiddleware.loginRequird,orderController.order)
router.get('/orders/:email',orderController.ordersemail)
router.get('/recievedorders',authMiddleware.loginRequird,orderController.recievedorders)
router.get('/ownorders',authMiddleware.loginRequird,orderController.ownorders)
router.get('/soldproduct',authMiddleware.loginRequird,orderController.soldproduct)
router.post('/updateOrderStatus',authMiddleware.loginRequird,orderController.updateOrderStatus)
router.get('/vieworders',orderController.vieworders)


// router.get('/viewpro',orderController.viewpro)
//router.post('/addpro', authMiddleware.loginRequird,productController.addpro)
router.post('/deletepro', authMiddleware.loginRequird,productController.deletepro)
router.post('/deleteprobyadmin',productController.deleteprobyadmin)
router.get('/check-eligibility/:productId', authMiddleware.loginRequird,productController.checkeligibility)

router.post('/submit-feedback', authMiddleware.loginRequird,feedbakController.submitfeedback)
router.get('/user-feedbacks', authMiddleware.loginRequird,feedbakController.getUserFeedbacks)
router.get('/check-feedback/:productId', authMiddleware.loginRequird,feedbakController.checkfeedback)
router.post('/addfeedback', authMiddleware.loginRequird,feedbakController.addfeedback)

router.put('/update-feedback/:feedbackId', authMiddleware.loginRequird,feedbakController.updateFeedback)

router.post('/searchpro',productController.searchpro)
router.put('/updateproduct/:id', authMiddleware.loginRequird,productController.editpeoduct)
router.put('/getproduct/:productId', authMiddleware.loginRequird,productController.getproduct)
router.post('/check-availability', authMiddleware.loginRequird,productController.checkavailability)



router.get('/viewallorders',orderController.viewallorders)
//router.get('/soldproducts/:userId',productController.soldproductsuserId)
router.post('/addpro', upload.any(), authMiddleware.loginRequird,productController.addpro)
router.get('/viewpro', authMiddleware.loginRequird,productController.viewpro)
router.get('/viewallpro',productController.viewallpro)
router.get('/viewpro2',productController.viewpro2)
router.post('/addrec', upload.any(), authMiddleware.loginRequird,recipeController.addrec)
router.post('/deleterec', authMiddleware.loginRequird,recipeController.deleterec)
router.post('/searchrec', authMiddleware.loginRequird,recipeController.searchrec)
router.get('/getUserRecipes', authMiddleware.loginRequird,recipeController.getUserRecipes)
router.get('/viewrec',recipeController.viewrec)
router.post('/deleterecipebyadmin',recipeController.deleterecipebyadmin)
router.post('/addtip',upload.any(), authMiddleware.loginRequird,tipController.addtip)
router.post('/deletetip', authMiddleware.loginRequird,tipController.deletetip)
router.post('/deletetipbyadmin',tipController.deletetipbyadmin)
router.get('/usertips', authMiddleware.loginRequird,tipController.getUserTips)
router.post('/searchtip',tipController.searchtip)
router.get('/viewtips',tipController.viewtips)
router.post('/deleteuser',userController.deleteuser)
router.get('/deleteuserid',userController.deleteuserid)
router.get('/getUserDetails',userController.getUserDetails)
router.get('/viewsign',userController.viewsign)
router.post('/blogs/add', upload.any(), authMiddleware.loginRequird, blogcontroller.addblog);
router.get('/blogs/all',authMiddleware.loginRequird,blogcontroller.getallblog)
router.get('/my-blogs/:userId',authMiddleware.loginRequird,blogcontroller.getownblog)
router.delete('/blogs/delete/:blogId',authMiddleware.loginRequird,blogcontroller.deleteblog)



router.post('/submit-complaint',upload.any(),authMiddleware.loginRequird,buyercomplaint.submitComplaint)
router.post('/update-complaint',authMiddleware.loginRequird,buyercomplaint.updateComplaint)
router.put('/update-complaintstatus/:complaintId',authMiddleware.loginRequird,buyercomplaint.updateComplaintStatus)
router.get('/user-complaints',authMiddleware.loginRequird,buyercomplaint.getUserComplaints)
router.get('/all-complaints',authMiddleware.loginRequird,buyercomplaint.getAllComplaints)
router.get('/check-existing-complaint',authMiddleware.loginRequird,buyercomplaint.checkExistingComplaint)





router.post('/send-announcement',upload.any(),authMiddleware.loginRequird,announcement.sendannouncement)
router.get('/announcements',authMiddleware.loginRequird,announcement.announcements)
router.post('/announcements/:id/comment',authMiddleware.loginRequird,announcement.comment)
router.post('/announcements/:announcementId/comments/:commentId/like',authMiddleware.loginRequird,announcement.like)






router.get('/seller/activities',authMiddleware.loginRequird,sellercontroller.selleractivities)
router.get('/seller/stats',authMiddleware.loginRequird,sellercontroller.sellerstats)



router.get('/admin/activities',authMiddleware.loginRequird,adminActivities.adminActivities)



router.post('/submit',authMiddleware.loginRequird,contactus.submit)
router.get('/all',authMiddleware.loginRequird,contactus.all)




module.exports = router