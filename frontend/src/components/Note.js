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
			<button onClick={handleClick}>DELETE</button>
		</div>
	);
}

export default Note