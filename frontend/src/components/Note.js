import React from 'react'
import '../pages/Home.css'

function Note(props) {
	function handleClick() {
		props.onDelete();
	}
  return (
		<div className="note">
			<h1>{props.title}</h1>
			<p>{props.content}</p>
			<h5>{props.date}</h5>
			<button onClick={handleClick}>DELETE</button>
		</div>
	);
}

export default Note