const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Project Model
const Project = require("../../models/Project");

// @route GET api/projects
// @desc Get all projects
// @access public
router.get("/", (req, res) => {
	Project.find()
		.sort({ date: -1 })
		.then((projects) => res.json(projects));
});

// @route POST api/projects
// @desc Add a project
// @access private
router.post("/", auth, (req, res) => {
	const newProject = new Project({
		name: req.body.name,
		content: req.body.content,
	});

	if (req.body.isPublic === true) {
		newProject.isPublic = true;
	}

	newProject
		.save()
		.then((project) => res.json(project))
		.catch((err) => res.status(400).json({ msg: "Project creation failed" }));
});

// @route DELETE api/projects/:id
// @desc Delete a project
// @access private
router.delete("/:id", auth, (req, res) => {
	Project.findById(req.params.id)
		.then((project) => project.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

// @route PUT api/projects/:id
// @desc Update a project
// @access private
router.put("/:id", auth, (req, res) => {
	Project.findById(req.params.id, (err, project) => {
		if (err) return res.status(404).json({ msg: "Resource not found" });
		project.name = req.body.name;
		project.content = req.body.content;
		project.isPublic = req.body.isPublic;

		project
			.save()
			.then((project) => res.json(project))
			.catch((err) => res.status(400).json({ msg: "Project update failed" }));
	});
});

module.exports = router;
