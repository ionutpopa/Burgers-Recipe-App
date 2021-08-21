const { Router } = require("express");
const { protect } = require("../../utils/auth");
const { User } = require("./user.model");

const router = Router();

router.get("/", protect, (req, res) => {
	res.status(200).json({ data: req.user });
});

router.put("/", (req, res) => {
	new Promise((resolve) => {
		const user = User.findByIdAndUpdate(req.user._id, req.body, {
			new: true,
		})
			.lean()
			.exec();

		resolve(user);
	})
		.then((user) => {
			res.status(200).json({ data: user });
		})
		.catch((error) => {
			console.error(error);
			res.status(400).end();
		});
});

module.exports = router;
