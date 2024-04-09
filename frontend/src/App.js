import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { AuthContext } from "./shared/AuthContext";
import Home from "./pages/Home";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);

	const login = useCallback((uid, token) => {
		
		setIsLoggedIn(true);
		setToken(token);
		setUserId(uid);	
		localStorage.setItem(
			"userData",
			JSON.stringify({ userId: uid, token: token })
		);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setToken(null)
		setUserId(null)
		localStorage.removeItem('userData')
	}, []);

	useEffect(()=>{
		const storedData = JSON.parse(localStorage.getItem('userData'))
		if(storedData && storedData.token){
			login(storedData.userId,storedData.token)
		}
	},[login])
	return (
		<div className="App">
			<AuthContext.Provider
				value={{
					isLoggedIn: isLoggedIn,
					Login: login,
					Logout: logout,
					token: token,
					userId: userId,
				}}
			>
				<Router>
					<Routes>
						<Route path="/" Component={Signin} />
						<Route path="/signin" Component={Signin} />
						{token && <Route path="/home" component={Home} />}
						<Route path="/signup" Component={Signup} />
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
