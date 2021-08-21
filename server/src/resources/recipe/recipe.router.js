const { Router } = require("express");
const { protect } = require("../../utils/auth");
const { Recipe } = require("./recipe.model");

const router = Router();

router.get("/", (req, res) => {
	new Promise((resolve) => {
		const docs = Recipe.find({}, { title: 1, description: 1, createdBy: 1 }).lean().exec();
		resolve(docs);
	})
		.then((docs) => {
			res.status(200).json({ data: docs });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/:id", (req, res) => {
	new Promise((resolve) => {
		const doc = Recipe.findOne({ _id: req.params.id }).lean().exec();
		resolve(doc);
	})
		.then((doc) => {
			if (!doc) {
				return res.status(400).end();
			}

			res.status(200).json({ data: doc });
		})
		.catch((error) => {
			console.error(error);
			res.status(400).end();
		});
});

router.post("/", protect, (req, res) => {
	const createdBy = req.user._id;
	new Promise((resolve) => {
		const doc = new Recipe({ ...req.body, createdBy: createdBy });
		doc.save().then(() => {
			res.status(201).json({ data: doc });
		});
		resolve(doc);
	}).catch((error) => {
		console.error(error);
		res.status(400).end();
	});
});

router.put("/:id", protect, (req, res) => {
	new Promise((resolve) => {
		const updatedDoc = Recipe.findOneAndUpdate(
			{
				createdBy: req.user._id,
				_id: req.params.id,
			},
			req.body,
			{ new: true }
		)
			.lean()
			.exec();

		if (!updatedDoc) {
			return res.status(400).end();
		}

		resolve(updatedDoc);
	})
	.then((updatedDoc) => {
		res.status(200).json({ data: updatedDoc });
	})
	.catch((error) => {
		console.error(error);
		res.status(400).end();
	})
});

router.delete("/:id", protect, (req, res) => {
	new Promise((resolve) => {
		const removed = Recipe.findOneAndRemove({
			createdBy: req.user._id,
			_id: req.params.id,
		});

		if (!removed) {
			return res.status(400).end();
		}

		resolve(removed)
	})
	.then((removed) => {
		return res.status(200).json({ data: removed });
	})
	.catch((error) => {
		console.error(error);
		res.status(400).end();
	})
});

module.exports = router;
