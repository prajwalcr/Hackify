const { request } = require("express");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Project Model
const Project = require("../../models/Project");

// Muter Storage Config
const multer = require("multer");

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if(ext !== '.jpg' && ext !== '.png' && ext !== '.mp4'){
			return cb(res.status(400).end("only .jpg, .png and .mp4 formats are allowed"), false);
		}
		cb(null, true);
	}
});

const upload = multer({storage: storage}).single("file");


// @route GET api/projects
// @desc Get all projects
// @access public
router.get("/", (req, res) => {
	Project.find()
		.sort({ date: -1 })
		.then((projects) => res.json(projects));
});

// @route GET api/projects/:id
// @desc Get a single project
// @access public
router.get("/:id", (req, res) => {
	Project.findById(req.params.id)
		.sort({ date: -1 })
		.then((project) => res.json([project]))
		.catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/projects
// @desc Add a project
// @access private
router.post("/", auth, (req, res) => {

	const newProject = new Project({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		isPublic: req.body.isPublic,
	});

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
	Project.findByIdAndUpdate(req.params.id, req.body, (err, project) => {
		if (err) return res.status(400).json({ msg: "Project update failed" });
		else return res.json(req.body)
	});
});

// @route POST api/projects/uploadfiles
// @desc Upload a file
// @access private
//need to include auth here
router.post("/uploadfiles", (req, res) => {
	upload(req, res, (err) => {
		if(err){
			return res.json({success: false, err});
		}
		return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename});
	})
});

module.exports = router;
