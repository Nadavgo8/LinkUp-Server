const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, dob } = req.body;
    if (!email || !password || !fullName || !dob)
      return res.status(400).json({ msg: "missing fields" });

    const age = calculateAge(dob);
    if (age < 16) return res.status(403).json({ msg: "must be 16+" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const photoUrl = req.file ? req.file.path : undefined;

    const user = await User.create({
      email,
      password: hashed,
      fullName,
      dob,
      photoUrl,
    });

    const token = createToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        photoUrl: user.photoUrl || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "missing" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "invalid credentials" });

    const token = createToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    next(err);
  }
};
