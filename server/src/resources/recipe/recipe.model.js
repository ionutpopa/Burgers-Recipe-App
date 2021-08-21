const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		description: {
			type: String,
			required: true,
		},
		createdBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{ timestamps: true }
);

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = {
	Recipe,
};
