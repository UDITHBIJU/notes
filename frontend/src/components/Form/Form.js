import React, { useContext, useState } from "react";
import "./Form.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/AuthContext";

function Form(props) {
	const auth = useContext(AuthContext)
	const [mail, setMail] = useState("");
	const[password,setPassword] = useState('')

	function mailHandler(e) {
		setMail(e.target.value)
	}
	function passHandler(e){
		setPassword(e.target.value)
	}
	function submitHandler(){
		auth.Login()
	}
	return (
		<div className="container">
			<h1>{props.title}</h1>

			<form action="" method="POSt" className="form">
				<input type="email" value={mail} placeholder="username" onChange={mailHandler} />
				<input type="password" placeholder="password" value={password} onChange={passHandler} />
				<input type="submit" value={props.option} onClick={submitHandler}/>
			</form>
			<h6>
				{props.footer}
				<Link to={`/${props.to}`}>{props.to}</Link>
			</h6>
		</div>
	);
}

export default Form;
