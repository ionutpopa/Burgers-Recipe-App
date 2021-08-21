import React from "react";
import { Formik, Field, Form } from "formik";
import "./Auth.css";
import { signup } from "../../utils/userCalls";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import Nav from "../nav/Nav";
import "./Auth.css";
import { Button } from "@material-ui/core";

const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Valid email is required!"),
	password: Yup.string()
		.required("No password provided")
		.min(8, "Password is too short - should be 8 chars minimum.")
		.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

const Signup = () => {
	let history = useHistory();
	return (
		<div>
			<Nav />
			<Formik
				initialValues={{
					password: "",
					email: "",
				}}
				validationSchema={SignupSchema}
				onSubmit={async (values) => {
					await new Promise((r) => setTimeout(r, 500));
					signup({
						email: values.email,
						password: values.password,
					})
						.then(() => {
							history.push({
								pathname: "/",
							});
						})
						.catch((error) => console.log(error));
				}}
			>
				{({ errors, touched }) => (
					<Form className="auth-container">
						<label htmlFor="email">Email</label>
						<Field id="email" name="email" placeholder="john@doe.com" type="email" />
						{touched.email && errors.email && <span className="errors">{errors.email}</span>}
						<label htmlFor="password">Password</label>
						<Field type="password" id="password" placeholder="********" name="password" />
						{touched.password && errors.password && <span className="errors">{errors.password}</span>}
						<br />
						<Button variant="contained" color="primary" type="submit">
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Signup;
