const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    	const {userDataJson } = req.body;
			const userData = JSON.parse(userDataJson);
            const token = userData.token;

	if (!token) {
		return res.status(401).json({ error: "Token not provided" });
	}

	jwt.verify(token, "secret_key", (err, decoded) => {
		if (err) {
			console.error("Token is not valid:", err);
			return res.status(401).json({ error: "Invalid token" });
		} else {
			req.user = decoded;
			next();
		}
	});
};

module.exports = verifyToken;
