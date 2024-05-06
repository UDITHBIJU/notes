import React, { useState } from "react";
import "./Home.css";
import Navbar from "../components/Navbar/Navbar";
import SidePanel from "../components/sidepanel/SidePanel";
import axios from "axios";
function Home() {
	const [note, setNote] = useState({
		title: "",
		content: "",
	});

	function handleChange(event) {
		const { name, value } = event.target;

		setNote((prevNote) => {
			return {
				...prevNote,
				[name]: value,
			};
		});
	}

	async function submitNote(event) {
		
		setNote({
			title: "",
			content: "",
		});
		event.preventDefault();
		try {
			const data = await axios.post(
				"http://localhost:4001/api/users/createnote",
				{
					title: note.title,
					content: note.content,
					userDataJson: localStorage.getItem("userData"),
				}
			);
			console.log(data);
		} catch (error) {
			console.error("Error creating note:", error);
			if (error.response && error.response.status === 401) {
				localStorage.removeItem("userData");
				window.location.href = "/signin";
			}
		}
	}

	return (
		<div>
			<Navbar />
			<SidePanel />
			<div className="container">
				<form
					onSubmit={submitNote}
					className="create"
					action="http://localhost:4001/api/users/createnote"
					method="POST"
				>
					<input
						name="title"
						onChange={handleChange}
						value={note.title}
						placeholder="Title"
					/>
					<textarea
						name="content"
						onChange={handleChange}
						value={note.content}
						placeholder="Take a note..."
						rows="3"
					/>
					<input
						type="hidden"
						name="userDataJson"
						value={localStorage.getItem("userData")}
					/>
					<button>Add</button>
				</form>
			</div>
		</div>
	);
}

export default Home;
