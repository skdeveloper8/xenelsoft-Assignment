const bcrypt = require("bcrypt");
const pool = require("../database/db");

const SALT_ROUNDS = 10;
const UNIQUE_VIOLATION = "23505";

function isDuplicateEmailError(error) {
  return error.code === UNIQUE_VIOLATION && error.constraint === "users_email_key";
}

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "password must be at least 8 characters long",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email.toLowerCase(), passwordHash]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return res.status(409).json({ message: "email already exists" });
    }

    return next(error);
  }
}

module.exports = {
  registerUser,
};
