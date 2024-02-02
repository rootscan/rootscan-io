import logger from '@/logger';
import redisClient from '@/redis';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { ensureLoggedIn } from 'connect-ensure-login';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

const BULLBOARD_USERNAME = process?.env?.BULLBOARD_USERNAME;
const BULLBOARD_PASSWORD = process?.env?.BULLBOARD_PASSWORD;

if (!BULLBOARD_USERNAME || !BULLBOARD_PASSWORD) {
  logger.error('Missing BULLBOARD_USERNAME or/and BULLBOARD_PASSWORD in .env');
  process.exit(1);
}

passport.use(
  new LocalStrategy(function (username, password, cb) {
    if (username === BULLBOARD_USERNAME && password === BULLBOARD_PASSWORD) {
      return cb(null, { user: 'bull-board' });
    }
    return cb(null, false);
  })
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.use(cors('*'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

if (!process?.env?.WORKERPOOL_QUEUE) {
  logger.error('Missing WORKERPOOL_QUEUE in .env');
  process.exit(1);
}

const queue: Queue = new Queue(process.env.WORKERPOOL_QUEUE, {
  connection: redisClient
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'c582e72fe60df1fb510421ed06d95f20', saveUninitialized: true, resave: true }));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize({}));
app.use(passport.session({}));

app.get('/ui/login', (req, res) => {
  res.render('login', { invalid: req.query.invalid === 'true' });
});

app.post('/ui/login', passport.authenticate('local', { failureRedirect: '/ui/login?invalid=true' }), (req, res) => {
  res.redirect('/ui');
});

app.use('/ui', ensureLoggedIn({ redirectTo: '/ui/login' }), serverAdapter.getRouter());
app.use('/ui', serverAdapter.getRouter());

app.listen(3002, () => {
  logger.info(`🚀 Bullboard on localhost:3002/ui`);
});
