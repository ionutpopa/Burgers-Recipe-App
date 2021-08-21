const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const config = require("./src/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connect } = require("./src/utils/db");

const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

const userRouter = require("./src/resources/user/user.router.js");
const recipeRouter = require("./src/resources/recipe/recipe.router");
const { signin, signup } = require("./src/utils/auth");

app.post("/signup", signup);
app.post("/signin", signin);

app.use("/api/user", userRouter);
app.use("/api/recipes", recipeRouter);

const start =  async() => {
	try {
		await connect();
		app.listen(config.port, () => {
			console.log(`REST API on http://localhost:${config.port}/api`);
		});
	} catch (e) {
		console.error(e);
	}
};

module.exports = {
	app,
	start,
};
