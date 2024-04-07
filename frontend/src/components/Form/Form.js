import React, { useContext, useState } from "react";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/AuthContext";
import axios from "axios";
import validator from "validator"; // Import validator package

function Form(props) {
	const auth = useContext(AuthContext);
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [isValidPassword, setIsValidPassword] = useState(true);
	const navigate = useNavigate();

	const mailHandler = (e) => {
		const emailValue = e.target.value;
		setMail(emailValue);
		setIsValidEmail(validator.isEmail(emailValue));
	};

	const passHandler = (e) => {
		const passwordValue = e.target.value;
		setPassword(passwordValue);
		setIsValidPassword(passwordValue.length >= 6); 
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (isValidEmail && isValidPassword) {
			try {
				const response = await axios.post(
					"http://localhost:4001/api/users/signup",
					{
						email: mail,
						password: password,
					}
				);
				console.log(response);
				auth.Login();
				navigate("/home");
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="container">
			<h1>{props.title}</h1>

			<form className="form" onSubmit={submitHandler}>
				<input
					type="email"
					value={mail}
					placeholder="username"
					onChange={mailHandler}
				/>
				{!isValidEmail && (
					<p style={{ color: "red", fontSize: "15px", margin: "0px" }}>
						Please enter a valid email
					</p>
				)}
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={passHandler}
				/>
				{!isValidPassword && (
					<p style={{ color: "red", fontSize: "15px", margin: "0px" }}>
						Password must be at least 6 characters long
					</p>
				)}
				<input
					type="submit"
					value={props.option}
					disabled={!isValidEmail || !isValidPassword}
				/>
			</form>
			<h6>
				{props.footer}
				<Link to={`/${props.to}`}>{props.to}</Link>
			</h6>
		</div>
	);
}

export default Form;
