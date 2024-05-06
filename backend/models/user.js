const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
	title: "string",
	content: "string",
	date:"string"
});
const reminderSchema = new mongoose.Schema({
	title: "string",
	message: "string",
	date: Date,
	dateString:'String'
});
const userSchema = new mongoose.Schema({
	email: "string",
	password: "string",
	lists: [listSchema],
	reminders:[reminderSchema]
});

module.exports = mongoose.model("User", userSchema);
