import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import "./Auth.css";
import { signin } from "../../utils/userCalls";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import Nav from "../nav/Nav";
import "./Auth.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from "@material-ui/core";

const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Please provide your email").required("Valid email is required!"),
	password: Yup.string().required("No password provided"),
});

const Login = ({location}) => {
	let history = useHistory();
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if(location.state && location.state.email && location.state.password) {
			signin({
				email: location.state.email,
				password: location.state.password,
			}).then((res) => {
				if (res) {
					setOpen(true);
				} else {
					history.push({
						pathname: "/",
					});
				}
			});
		}
	}, [history, location.state])

	return (
		<div>
			<Nav />
			<Formik
				initialValues={{
					password: "",
					email: "",
				}}
				validationSchema={LoginSchema}
				onSubmit={(values) => {
					signin({
						email: values.email,
						password: values.password,
					}).then((res) => {
						if (res) {
							setOpen(true);
						} else {
							history.push({
								pathname: "/",
							});
						}
					});
				}}
			>
				{({ errors, touched }) => (
					<Form className="auth-container">
						<label htmlFor="email">Email</label>
						<Field id="email" name="email" type="email" />
						{touched.email && errors.email && <span className="errors">{errors.email}</span>}
						<label htmlFor="password">Password</label>
						<Field type="password" id="password" name="password" />
						{touched.password && errors.password && <span className="errors">{errors.password}</span>}
						<br />
						<Button variant="contained" color="primary" type="submit">
							Login
						</Button>
					</Form>
				)}
			</Formik>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You entered the wrong Email or Password
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Login;
