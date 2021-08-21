import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/Home";
import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Recipe from "./components/recipe/Recipe";

const App = () => {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/signin" component={Login} />
					<Route exact path="/signup" component={Signup} />
					<Route exact path="/recipes/:_id" component={Recipe} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
