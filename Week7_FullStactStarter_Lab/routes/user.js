const express = require("express");
const router = express.Router();
const User = require("../models/User");

function isMemoryMode(req) {
	return req.app.locals.useMemoryStore === true;
}

function getMemoryUsers(req) {
	return req.app.locals.inMemoryUsers;
}

function normalizeUser(data = {}) {
	const name = String(data.name ?? "").trim();
	const email = String(data.email ?? "").trim().toLowerCase();
	const age = data.age === "" || data.age === undefined || data.age === null ? null : Number(data.age);

	if (!name || !email) {
		throw new Error("Name and email are required");
	}
	if (age !== null && (!Number.isFinite(age) || age < 1)) {
		throw new Error("Age must be a positive number");
	}

	return { name, email, age };
}

// CREATE
router.post("/", async (req, res) => {
	if (isMemoryMode(req)) {
		try {
			const userData = normalizeUser(req.body);
			const users = getMemoryUsers(req);
			if (users.some((user) => user.email === userData.email)) {
				return res.status(400).json({ error: "Email already exists" });
			}

			const now = new Date();
			const user = { _id: `${Date.now()}-${users.length + 1}`, ...userData, createdAt: now, updatedAt: now };
			users.push(user);
			return res.status(201).json(user);
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	try {
		const user = await User.create(req.body);
		return res.status(201).json(user);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
});

// READ ALL
router.get("/", async (req, res) => {
	if (isMemoryMode(req)) {
		return res.json([...getMemoryUsers(req)].sort((a, b) => b.createdAt - a.createdAt));
	}

	const users = await User.find().sort({ createdAt: -1 });
	return res.json(users);
});

// UPDATE
router.put("/:id", async (req, res) => {
	if (isMemoryMode(req)) {
		try {
			const user = getMemoryUsers(req).find((item) => item._id === req.params.id);
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			const updates = normalizeUser({ ...user, ...req.body });
			if (getMemoryUsers(req).some((item) => item._id !== user._id && item.email === updates.email)) {
				return res.status(400).json({ error: "Email already exists" });
			}
			Object.assign(user, updates, { updatedAt: new Date() });
			return res.json(user);
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	try {
		const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
});

// DELETE
router.delete("/:id", async (req, res) => {
	if (isMemoryMode(req)) {
		const users = getMemoryUsers(req);
		const index = users.findIndex((user) => user._id === req.params.id);
		if (index === -1) {
			return res.status(404).json({ error: "User not found" });
		}
		users.splice(index, 1);
		return res.json({ message: "User deleted" });
	}

	try {
		const deleted = await User.findByIdAndDelete(req.params.id);
		if (!deleted) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.json({ message: "User deleted" });
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
});

module.exports = router;
