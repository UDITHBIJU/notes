const User = require("../models/user");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const signup = async (req, res, next) => {
	const { email, password } = req.body;
            console.log(req.body);

	const existingUser = await User.findOne({ email: email });

	if (existingUser) {
		console.log(existingUser);
		return res.status(400).json({ error: "User already exists" });
	} else {
		try {
			const hashedPassword = await bcrypt.hash(password, saltRounds); 
			const createdUser = new User({
				email:email,
				password: hashedPassword, 
			});
			await createdUser.save(); 
			return res.status(201).json({ message: "User created successfully" });
		} catch (error) {
			console.error("Error creating user:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
};

const signin = async (req, res, next) => {
	const { email, password } = req.body;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		try {
			const match = await bcrypt.compare(password, existingUser.password); 
			if (match) {
				return res.status(200).json({ message: "Signin successful" });
			} else {
				return res.status(400).json({ error: "Invalid password" });
			}
		} catch (error) {
			console.error("Error comparing passwords:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(400).json({ error: "User not found" });
	}
};

exports.signin = signin;
exports.signup = signup;
