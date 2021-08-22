import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { deleteRecipe, getRecipe, updateRecipe } from "../../utils/recipeCalls";
import { Formik, Field, Form } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { getUser } from "../../utils/userCalls";
import Nav from "../nav/Nav";
import "./Recipe.css";
import { Button, Container, Typography } from "@material-ui/core";

const RecipeSchema = Yup.object().shape({
	title: Yup.string().required("Title is required!"),
	description: Yup.string().required("Description is required!"),
});

const Recipe = ({ location }) => {
	const [recipe, setRecipe] = useState(null);
	const [user, setUser] = useState(null);
	const [update, setUpdate] = useState(false);
	const id = location.state.id;
	const createdBy = location.state.createdBy;
	const token = Cookies.get("token");
	let history = useHistory();

	useEffect(() => { // componentDidMount
		getRecipe(id).then((res) => {
			setRecipe(res?.data.data);
		});
		if (token) {
			getUser(token).then((res) => {
				setUser(res?.data.data._id);
			});
		}
	}, [id, token]);

	const updateR = () => {
		setUpdate(true);
	};

	const deleteR = () => {
		deleteRecipe(token, id).then(() => {
			history.push({
				pathname: "/",
			});
		});
	};

	const CustomInputComponent = (props) => <textarea className="description-field" type="text" {...props} />;

	return (
		<>
			<Nav />
			<Container maxWidth="sm" className="reciepe">
				<br />
				<Typography gutterBottom variant="h5" component="h2">
					{recipe?.title}
				</Typography>
				<Typography align="left" display="block">
					{recipe?.description}
				</Typography>
				{user === createdBy ? (
					<div>
						<div className="ud-buttons">
							<Button variant="contained" color="secondary" onClick={deleteR}>
								Delete Recipe
							</Button>
							<Button variant="contained" color="primary" onClick={updateR}>
								Update Recipe
							</Button>
						</div>
						{update ? (
							<Formik
								initialValues={{
									title: recipe.title,
									description: recipe.description,
								}}
								validationSchema={RecipeSchema}
								onSubmit={(values) => {
									updateRecipe(token, id, {
										title: values.title,
										description: values.description,
									}).then(() => {
										getRecipe(id).then((res) => {
											setRecipe(res.data.data);
											setUpdate(false);
										});
									});
								}}
							>
								{({ errors, touched }) => (
									<Form className="form">
										<label htmlFor="title">New Title</label>
										<Field id="title" name="title" type="title" />
										{touched.title && errors.title && (
											<span className="errors">{errors.title}</span>
										)}
										<label htmlFor="description">New Description</label>
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
										<Button variant="contained" color="primary" type="submit">
											Update
										</Button>
									</Form>
								)}
							</Formik>
						) : null}
					</div>
				) : null}
			</Container>
		</>
	);
};

export default Recipe;
