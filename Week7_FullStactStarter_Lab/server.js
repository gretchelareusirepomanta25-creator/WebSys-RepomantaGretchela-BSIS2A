const usersRouter = require("./routes/user");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();


const app = express();
app.locals.useMemoryStore = false;
app.locals.inMemoryUsers = [];

// Body parsers (required so req.body will not be undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/users", usersRouter);

// Test route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Mongo connect + start server
async function start() {
	const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/week7_users";

	try {
		await mongoose.connect(mongoUri);
		console.log("MongoDB connected");
	} catch (err) {
		app.locals.useMemoryStore = true;
		console.warn("MongoDB not available; using in-memory fallback store.", err.message);
	}

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
