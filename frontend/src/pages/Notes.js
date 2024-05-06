import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import Note from "../components/Note";
import SidePanel from "../components/sidepanel/SidePanel";
function Notes() {
	const [userNotes, setUserNotes] = useState([]);

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem("userData"));

		async function fetchNotes() {
			try {
				const response = await axios.get(
					`http://localhost:4001/api/users/mynotes`,
					{
						params: {
							userId: userData.userId,
						},
					}
				);
				setUserNotes(response.data);
			} catch (error) {
				console.error("Error fetching user notes:", error);
			}
		}

		fetchNotes();
	}, []);
	const deleteNote = async (noteId) => {
		try {
			await axios.delete(`http://localhost:4001/api/users/note/${noteId}`, {
				params: { userId: JSON.parse(localStorage.getItem("userData")).userId },
			});
			const updatedNotes = userNotes.filter((note) => note._id !== noteId);
			setUserNotes(updatedNotes);
		} catch (error) {
			console.error("Error deleting note:", error);
		}
	};

	return (
		<div>
			<Navbar />
			<SidePanel />
			{userNotes.map((note, index) => (
				<Note
					title={note.title}
					content={note.content}
					date = {note.date}
					key={note._id}
					onDelete={() => deleteNote(note._id)}
				/>
			))}
		</div>
	);
}

export default Notes;
