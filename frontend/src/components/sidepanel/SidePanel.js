import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidepanel.css";

function SidePanel() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidePanel = () => {
		setIsOpen(!isOpen);
	};
const handleLogout = () => {
    
    localStorage.removeItem("userData");
	window.location.href = "/signin";
   
   
}

	return (
		<div className={`side-panel ${isOpen ? "open" : ""}`}>
			<button className="toggle-btn" onClick={toggleSidePanel}>
				Toggle Panel
			</button>
			<h2>Navigation</h2>
			<ul>
				<li>
					<Link to="/home">Home</Link>
				</li>
				<li>
					<Link to="/notes">Notes</Link>
				</li>
			</ul>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default SidePanel;
