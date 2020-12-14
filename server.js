const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");

const app = express();

// Bodyparser Middleware
app.use(express.json({ limit: "100mb" }));

// Get mongoURI
const db = config.get("mongoURI");

// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err));

// Routing
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/projects", require("./routes/api/projects"));

app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (true) {
	// Set static folder
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
