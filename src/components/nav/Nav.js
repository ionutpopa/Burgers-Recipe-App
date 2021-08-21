import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import Cookies from "js-cookie";
import "./Nav.css";

const Nav = () => {
	let history = useHistory();
	const token = Cookies.get("token");
	const logout = () => {
		new Promise((resolve) => {
			resolve(
				Cookies.remove("token", {
					sameSite: "strict",
					secure: true,
					expires: 9999,
				})
			);
		}).then(() => {
			window.location.reload(false);
		});
	};
	return (
		<header className="header">
			<h3 onClick={() => history.push("/")}>Burgers Recipes</h3>

			<div className="buttons">
				{token ? (
					<Button onClick={logout} className="login" variant="contained" color="primary">
						Logout
					</Button>
				) : (
					<Link to="/signin">
						<Button className="login" variant="contained" color="primary">
							Login
						</Button>
					</Link>
				)}
				<Link to="/signup">
					<Button className="signup" variant="contained" color="primary">
						Signup
					</Button>
				</Link>
			</div>
		</header>
	);
};

export default Nav;
