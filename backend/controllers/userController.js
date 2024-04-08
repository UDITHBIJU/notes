const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

let otpValue = null;

const saltRounds = 10;
const signup = async (req, res, next) => {
	const { email, password, otp } = req.body;

	try {
		if (otpValue == null || !otpValue === otp) {
			console.log(otpValue);
			return res.status(400).send("Invalid OTP");
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const createdUser = new User({
			email: email,
			password: hashedPassword,
		});

		await createdUser.save();
		otpValue = null;
		let token;
		token = jwt.sign(
			{
				userId: createdUser.id,
				email: createdUser.email,
			},
			"secret_key",
			{ expiresIn: "1h" }
		);
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
				
				return res
					.status(200)
					.json({
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
	port: 587,
	auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const otp = async (req, res) => {
	const { email } = req.body;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		return res.status(400).json({ error: "User already exists" });
	} else {
		otpValue = generateOTP();

		sendOTP(email, otpValue)
			.then(() => {
				res.status(200).send("OTP sent successfully");
			})
			.catch((error) => {
				console.error("Error sending OTP:", error);
				res.status(500).send("Failed to send OTP");
			});
	}
};
otpValue = generateOTP();
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
				console.log("Email sent: " + info.response);
				resolve();
			}
		});
	});
}

exports.signin = signin;
exports.signup = signup;
exports.otp = otp;
