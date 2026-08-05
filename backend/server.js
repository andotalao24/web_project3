import 'dotenv/config';

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import { connect, getDb } from './db.js';
import { isAuthenticated } from './guard.js';
import authRoutes from './routes/auth.js';
import pantryRoutes from './routes/pantry.js';
import groceryRoutes from './routes/grocery.js';
import recipeRoutes from './routes/recipes.js';

const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tell passport how to check a login: look up the user, then compare passwords.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const foundUser = await getDb().collection('users').findOne({ username });

      if (!foundUser) {
        return done(null, false, { message: 'Unknown user' });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        foundUser.passwordHash,
      );
      if (!passwordMatches) {
        return done(null, false, { message: 'Wrong password' });
      }

      return done(null, foundUser);
    } catch (err) {
      return done(err);
    }
  }),
);

// We only keep the user id in the session cookie...
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// ...and load the full user back from the id on each request.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDb()
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

async function main() {
  await connect();

  const app = express();
  app.use(express.json());

  // Behind Render's proxy, trust it so secure cookies work.
  app.set('trust proxy', 1);

  // Sessions stored in Mongo so logins survive server restarts.
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
        dbName: process.env.DB_NAME || 'pantrypal',
      }),
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api/auth', authRoutes);
  app.use('/api/pantry', isAuthenticated, pantryRoutes);
  app.use('/api/grocery', isAuthenticated, groceryRoutes);
  app.use('/api/recipes', isAuthenticated, recipeRoutes);

  // In production, serve the built React app from the same server.
  const frontendDist = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // Any non-API route falls back to the React app (single-page app).
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  // Central error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  });

  app.listen(PORT, () =>
    console.log(`PantryPal API running on http://localhost:${PORT}`),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
