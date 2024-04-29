const express = require("express");
const {
	signin,
	signup,
	otp,
	createNote,
	sendNotes,
	DeleteNotes,
    logout
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/otp", otp);
router.post("/createnote",verifyToken, createNote);
router.get("/mynotes", sendNotes);
router.delete("/note/:noteId", DeleteNotes);
router.post('logout',logout)

module.exports = router;
