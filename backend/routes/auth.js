import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { getDb } from '../db.js';
import { isAuthenticated } from '../guard.js';

const router = express.Router();

function publicUser(user) {
  return { id: user._id, username: user.username };
}

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const users = getDb().collection('users');

    const taken = await users.findOne({ username });
    if (taken) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      username,
      passwordHash,
      createdAt: new Date(),
    });

    const newUser = { _id: result.insertedId, username };
    req.login(newUser, (err) => {
      if (err) return next(err);
      res.status(201).json(publicUser(newUser));
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Login failed' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json(publicUser(user));
    });
  })(req, res, next);
});

// Log out and clear the session.
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});

// Get the current logged-in user (protected route).
router.get('/user', isAuthenticated, (req, res) => {
  delete req.user.passwordHash;
  res.json({ user: req.user });
});

export default router;
