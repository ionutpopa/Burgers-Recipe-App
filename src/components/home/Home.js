import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Button, Typography } from "@material-ui/core";
import Cookies from "js-cookie";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { postRecipe, getRecipes } from "../../utils/recipeCalls";
import Nav from "../nav/Nav";
import "./Home.css";

const RecipeSchema = Yup.object().shape({
	title: Yup.string().required("Title is required!"),
	description: Yup.string().required("Description is required!"),
});

const Home = () => {
	const [recipes, setRecipes] = useState(null);
	const token = Cookies.get("token");

	useEffect(() => { // componentDidMount
		getRecipes().then((res) => {
			setRecipes(res.data.data);
		});
	}, []);

	const CustomInputComponent = (props) => <textarea className="description-field" type="text" {...props} />;

	return (
		<div className="Home">
			<Nav />
			<div>
				{token ? (
					<Formik
						initialValues={{
							title: "",
							description: "",
						}}
						validationSchema={RecipeSchema}
						onSubmit={(values, { resetForm }) => {
							postRecipe(token, {
								title: values.title,
								description: values.description,
							}).then(() => {
								getRecipes().then((res) => {
									setRecipes(res.data.data);
								});
								resetForm();
							});
						}}
					>
						{({ errors, touched }) => (
							<Form className="home-form">
								<label htmlFor="title">Title</label>
								<Field id="title" name="title" type="title" />
								{touched.title && errors.title && <span className="errors">{errors.title}</span>}
								<label htmlFor="description">Description</label>
								<Field
									as={CustomInputComponent}
									type="description"
									id="description"
									name="description"
								/>
								{touched.description && errors.description && (
									<span className="errors">{errors.description}</span>
								)}
								<br />
								<Button className="submit-button" variant="contained" color="primary" type="submit">
									Submit
								</Button>
							</Form>
						)}
					</Formik>
				) : null}
			</div>
			<div className="recipes-container">
				{!recipes
					? null
					: recipes.map((recipe) => {
							return (
								<Link
									className="link"
									key={recipe._id}
									to={{
										pathname: `/recipes/${recipe._id}`,
										state: {
											id: recipe._id,
											createdBy: recipe.createdBy,
										},
									}}
								>
									<Card raised={true} className="recipe">
										<CardContent>
											<Typography gutterBottom variant="h5" component="h2">
												{recipe?.title}
											</Typography>
											<Typography variant="body2" color="textSecondary" component="p">
												{recipe?.description}
											</Typography>
										</CardContent>
									</Card>
								</Link>
							);
					  })}
			</div>
		</div>
	);
};

export default Home;
