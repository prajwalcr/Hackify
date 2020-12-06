const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
	const { name, email, phone, password, errMsg } = req.body;

	// Validation
	if (!name || !email || !phone || !password) {
		return res.status(400).json({ msg: "Please enter all the fields" });
	}
	// Further work ...
	if (errMsg) {
		return res.status(400).json({ msg: errMsg });
	}

	// Checking for existing users
	User.findOne({ email: email }).then((user) => {
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}
	});

	const newUser = new User({
		name,
		email,
		phone,
		password,
	});

	// Create salt and hash
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save().then((user) => {
				jwt.sign(
					{ id: user._id },
					config.get("jwtSecret"),
					{ expiresIn: 3600 * 24 },
					(err, token) => {
						if (err) throw err;
						return res.json({
							token: token,
							user: {
								id: user._id,
								name: user.name,
								email: user.email,
							},
						});
					},
				);
			});
		});
	});
});

// @route PUT api/users/:id
// @desc Update user profile
// @access Private
router.put("/:id", auth, (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) return res.status(404).json({ msg: "Resource not found" });
		user.name = req.body.name;

		user
			.save()
			.then((user) => res.json(user))
			.catch((err) => res.status(400).json({ msg: "Project update failed" }));
	});
});

module.exports = router;
