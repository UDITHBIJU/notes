import React, { useContext, useState, useEffect } from "react";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/AuthContext";
import axios from "axios";
import validator from "validator";

function Form(props) {
	const auth = useContext(AuthContext);
	const [mail, setMail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isValidPassword, setIsValidPassword] = useState(false);
	const [isValidOtp, setIsValidOtp] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		
		setErrorMessage("");
	}, []);

	const mailHandler = (e) => {
		const emailValue = e.target.value;
		setMail(emailValue);
		setIsValidEmail(validator.isEmail(emailValue));
		setErrorMessage(""); 
	};

	const otpHandler = (e) => {
		const otpValue = e.target.value;
		setOtp(otpValue);
		setIsValidOtp(otpValue.length === 6);
		setErrorMessage(""); 
	};

	const passHandler = (e) => {
		const passwordValue = e.target.value;
		setPassword(passwordValue);
		setIsValidPassword(passwordValue.length >= 6);
		setErrorMessage("");
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (isValidEmail && isValidPassword ) {
			const uri =
				props.to !== "signup"
					? "http://localhost:4001/api/users/signup"
					: "http://localhost:4001/api/users/signin";
			try {
				
				let postData = {
					email: mail,
					password: password,
				};
				if (props.to !== "signup") {
					postData.otp = otp;
				}
				const response = await axios.post(uri, postData);

				

				auth.Login(response.userId,response.token); 

				navigate("/home"); 
			} catch (error) {
				console.log(error)
				setErrorMessage("Invalid credentials"); 
			}
		} else if (!isValidEmail || (!isValidPassword && !isValidOtp)) {
			setErrorMessage("Invalid credentials"); 
		}
	};

	async function otpGenerate() {
		if (isValidEmail) {
			const uri = "http://localhost:4001/api/users/otp";
			try {
			await axios.post(uri, {
					email: mail,
				});

				setErrorMessage("");
			} catch (error) {
				setErrorMessage("user already exists");
				setMail("");
			}
		}
	}

	const otpComponent = props.to !== "signup" && (
		<>
			<input
				type="number"
				placeholder="otp"
				value={otp}
				onChange={otpHandler}
			/>
			<button onClick={otpGenerate} disabled={!isValidEmail}>
				generate
			</button>
		</>
	);

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
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={passHandler}
				/>
				{otpComponent}
				<input
					type="submit"
					value={props.option}
					disabled={!isValidEmail || !isValidPassword || props.to!=="signup"?!isValidOtp:null}
				/>
			</form>
			{errorMessage && (
				<p style={{ color: "red", fontSize: "15px", margin: "0px" }}>
					{errorMessage}
				</p>
			)}
			<h6>
				{props.footer}
				<Link to={`/${props.to}`}>{props.to}</Link>
			</h6>
		</div>
	);
}

export default Form;
