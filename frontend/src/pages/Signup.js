import React from 'react'
import Navbar from "../components/Navbar/Navbar";
import Form from '../components/Form/Form';


function Signup() {
  return (
		<div>
			<Navbar />
			<Form
				title="Welcome Back !"
				option="Sign Up"
				footer="Already have an account ?"
				to="signin"
			/>
     
		</div>
	);
}

export default Signup