import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Form from "../components/Form/Form";

function Signin() {
	return (
		<div>
			<Navbar />
			<Form
				title="Welcome Back !"
				option="Log in"
				footer="Don't have a account ?"
				to="signup"
			/>
		</div>
	);
}

export default Signin;
