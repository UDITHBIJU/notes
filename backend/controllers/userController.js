const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

let otpMap = new Map();

const saltRounds = 10;
const signup = async (req, res, next) => {
	const { email, password, otp } = req.body;

	try {
		if (!otpMap.has(email) || otpMap.get(email) !== otp) {
			return res.status(400).send("Invalid OTP");
		}
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const createdUser = new User({
			email: email,
			password: hashedPassword,
		});

		await createdUser.save();

		let token;
		token = jwt.sign(
			{
				userId: createdUser.id,
				email: createdUser.email,
			},
			"secret_key",
			{ expiresIn: "1h" }
		);
		otpMap.delete(email);
		return res.status(201).json({
			message: "User created successfully",
			userId: createdUser.id,
			email: createdUser.email,
			token: token,
		});
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};

const signin = async (req, res, next) => {
	const { email, password } = req.body;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		try {
			const match = await bcrypt.compare(password, existingUser.password);
			let token;
			token = jwt.sign(
				{
					userId: existingUser.id,
					email: existingUser.email,
				},
				"secret_key",
				{ expiresIn: "1h" }
			);
			if (match) {
				return res.status(200).json({
					message: "Signin successful",
					userId: existingUser.id,
					email: existingUser.email,
					token: token,
				});
			} else {
				return res.status(400).json({ error: "Invalid password" });
			}
		} catch (error) {
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(400).json({ error: "User not found" });
	}
};
var transporter = nodemailer.createTransport({
	host: "live.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
		type: "login",
	},
});

const otp = async (req, res) => {
	const { email } = req.body;
	const existingUser = await User.findOne({ email: email });

	if (existingUser) {
		return res.status(400).json({ error: "User already exists" });
	} else {
		const generatedOTP = generateOTP();

		otpMap.set(email, generatedOTP + "");

		sendOTP(email, generatedOTP)
			.then(() => {
				res.status(200).send("OTP sent successfully");
			})
			.catch((error) => {
				console.error("Error sending OTP:", error);
				res.status(500).send("Failed to send OTP");
			});
	}
};

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000);
}

function sendOTP(email, otp) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: "udith@kiranks.me",
			to: email,
			subject: "OTP Verification",
			text: `Your OTP for verification is: ${otp}`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
function getCurrentDate() {
	const currentDate = new Date();
	const day = currentDate.getDate();
	const month = currentDate.getMonth() + 1;
	const year = currentDate.getFullYear();

	const formattedDay = day < 10 ? "0" + day : day;
	const formattedMonth = month < 10 ? "0" + month : month;

	return `${formattedDay}/${formattedMonth}/${year}`;
}
const createNote = async (req, res) => {
	const { title, content, userDataJson } = req.body;
	const userData = JSON.parse(userDataJson);
	const user = await User.findById(userData.userId);
	
	user.lists.push({ title: title, content: content,date:getCurrentDate() });
	await user.save();
	res.redirect("http://localhost:3000/home");
};

const sendNotes = async (req, res) => {
	const userId = req.query.userId;
	const user = await User.findById(userId);
	const lists = user.lists;
	res.status(200).json(lists);
};
const DeleteNotes = async (req, res) => {
	const userId = req.query.userId;
	const noteId = req.params.noteId;
	const user = await User.findById(userId);

	user.lists.pull({ _id: noteId });
	await user.save();
	res.status(200).json({ message: "Note deleted successfully" });
};
const sendReminder = async (req, res) => {
	const userId = req.query.userId;
	const user = await User.findById(userId);
	const reminder = user.reminders;
	res.status(200).json(reminder);
};
const DeleteReminder = async (req, res) => {
	const userId = req.query.userId;
	const reminderId = req.params.reminderId;
	const user = await User.findById(userId);
	user.reminders.pull({ _id: reminderId });
	await user.save();
	res.status(200).json({ message: "reminder deleted successfully" });
};
const addReminder = async (req, res) => {
	const { title, date, message, userDataJson } = req.body;
	const userData = JSON.parse(userDataJson);
	const user = await User.findById(userData.userId);
	user.reminders.push({ title: title, date: date, message: message ,dateString:getCurrentDate()});
	await user.save();
};
const logout = async (req, res) => {};

exports.logout = logout;
exports.signin = signin;
exports.signup = signup;
exports.otp = otp;
exports.createNote = createNote;
exports.sendNotes = sendNotes;
exports.DeleteNotes = DeleteNotes;
exports.addReminder = addReminder;
exports.sendReminder = sendReminder;
exports.DeleteReminder = DeleteReminder;
