const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
		unique: true,
	},
	isPublic: {
		type: Boolean,
		default: false,
	},
	register_date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Project = mongoose.model("project", ProjectSchema);
