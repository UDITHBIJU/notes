const express = require("express");
const { signin, signup, otp } = require("../controllers/userController");

const router = express.Router();

router.post('/signin',signin)
router.post("/signup",signup);
router.post('/otp',otp)


module.exports = router;
