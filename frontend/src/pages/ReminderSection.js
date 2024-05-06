import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import Note from "../components/Note";
import SidePanel from "../components/sidepanel/SidePanel";
function Reminder() {
	const [userReminder, setUserReminder] = useState([]);

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem("userData"));

		async function fetchReminder() {
			try {
				const response = await axios.get(
					`http://localhost:4001/api/users/myreminder`,
					{
						params: {
							userId: userData.userId,
						},
					}
				);
				setUserReminder(response.data);
			} catch (error) {
				console.error("Error fetching user notes:", error);
			}
		}

		fetchReminder();
	}, []);
	const deleteReminder = async (reminderId) => {
		try {
			await axios.delete(`http://localhost:4001/api/users/reminder/${reminderId}`, {
				params: { userId: JSON.parse(localStorage.getItem("userData")).userId },
			});
			const updatedReminder = userReminder.filter((reminder) => reminder._id !== reminderId);
			setUserReminder(updatedReminder);
		} catch (error) {
			console.error("Error deleting Reminder:", error);
		}
	};

	return (
		<div>
			<Navbar />
			<SidePanel />
			{userReminder.map((reminder, index) => (
				<Note
					title={reminder.title}
					content={reminder.message}
					key={reminder._id}
					date={"reminder setted on "+reminder.dateString }
					onDelete={() => deleteReminder(reminder._id)}
				/>
			))}
		</div>
	);
}

export default Reminder;
