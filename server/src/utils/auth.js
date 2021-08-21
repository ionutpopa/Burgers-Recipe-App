const config = require("../config");
const { User } = require("../resources/user/user.model");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
	return jwt.sign({ id: user.id }, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp,
	});
};

const verifyToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) {
				return reject(err);
			}
			resolve(payload);
		});
	});

const signup = (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.status(400).send({ message: "Email and password required" });
	}

	new Promise((resolve) => {
		const user = User.create(req.body);
		const token = newToken(user);
		resolve(res.status(202).send({ token: token }));
	}).catch((error) => {
		console.log(error);
		return res.status(400).end();
	});
};

const signin = (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.status(400).send({ message: "need email and password" });
	}

	const invalid = { message: "Invalid email and passoword combination" };

	new Promise((resolve) => {
		const user = User.findOne({ email: req.body.email }).select("email password").exec();
		resolve(user);
	})
		.then((user) => {
			if (!user) {
				return res.status(401).send(invalid);
			}

			new Promise((resolve) => {
				const match = user.checkPassword(req.body.password);
				resolve(match);
			}).then((match) => {
				if (!match) {
					return res.status(401).send(invalid);
				}

				const token = newToken(user);
				res.status(201).send({ token: token });
			});
		})
		.catch((error) => {
			console.error(error);
			res.status(500).end();
		});
};

const protect = async (req, res, next) => {
	const bearer = req.headers.authorization;

	if (!bearer || !bearer.startsWith("Bearer ")) {
		return res.status(401).end();
	}

	const token = bearer.split("Bearer ")[1].trim();
	let payload;

	
	try {
		payload = await verifyToken(token);
	} catch (e) {
		return res.status(401).end();
	}

	const user = await User.findById(payload.id).select("-password").lean().exec();

	if (!user) {
		return res.status(401).end();
	}

	req.user = user;
	next();
};

module.exports = {
	newToken,
	verifyToken,
	signup,
	signin,
	protect,
};
