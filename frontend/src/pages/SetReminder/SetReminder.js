import React, { useState } from "react";
import "./SetReminder.css";

import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import SidePanel from "../../components/sidepanel/SidePanel";

function Reminder() {
	const [reminder, setReminder] = useState({
		title: "",
		date: "",
		message: "",
	});

	function handleChange(event) {
		const { name, value } = event.target;

		setReminder((prevReminder) => {
			return {
				...prevReminder,
				[name]: value,
			};
		});
	}

	async function submitReminder(event) {
		setReminder({
			title: "",
			content: "",
			message: "",
		});
		event.preventDefault();
		try {
			const data = await axios.post(
				"http://localhost:4001/api/users/addreminder",
				{
					title: reminder.title,
					date: reminder.date,
					message: reminder.message,
					userDataJson: localStorage.getItem("userData"),
				}
			);
			console.log(data);
		} catch (error) {
			console.error("Error adding reminder:", error);
		}
	}
	const isFormValid = reminder.title && reminder.date && reminder.message;

	return (
		<div>
			<Navbar />

			<SidePanel />
			<div className="reminder-container">
				<form
					onSubmit={submitReminder}
					className="create-reminder"
					action="http://localhost:4001/api/users/addreminder"
					method="POST"
				>
					<input
						name="title"
						onChange={handleChange}
						value={reminder.title}
						placeholder="Title"
					/>
					<input
						type="date"
						name="date"
						onChange={handleChange}
						value={reminder.date}
						placeholder="Date"
					/>
					<textarea
						name="message"
						onChange={handleChange}
						value={reminder.message}
						placeholder="Reminder message..."
						rows="3"
					/>
					<input
						type="hidden"
						name="userDataJson"
						value={localStorage.getItem("userData")}
					/>
					<button type="submit" disabled={!isFormValid}>
						Add Reminder
					</button>
				</form>
			</div>
		</div>
	);
}

export default Reminder;
