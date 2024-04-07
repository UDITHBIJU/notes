import React, { useCallback, useState } from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { AuthContext } from "./shared/AuthContext";
import Home from "./pages/Home";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = useCallback(() => {
		setIsLoggedIn(true);
  
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
	}, []);


	return (
		<div className="App">
			<AuthContext.Provider
				value={{ isLoggedIn: isLoggedIn, Login: login, Logout: logout }}
			>
				<Router>
					<Routes>
						<Route path="/" Component={Signin} />
						<Route path="/signin" Component={Signup} />
						{isLoggedIn&&<Route path="/home" component={Home} />}
						<Route path="/signup" Component={Signup} />
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
