'use strict'

import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cookieParser from 'cookie-parser'

import * as db from './db.js'

const app = express();
app.use(cookieParser());
const port = 3001;

// JWT signing token
const secret = crypto.randomBytes(64);
app.locals.secret = secret;

app.get('/auth', (req, res) => {
	res.send('EXPRESS POST CREATE');
});

app.get('/token', (req, res) => {
	console.log(req.query.username);
	let token = jwt.sign({ username: req.query.username }, app.locals.secret);
	res.set({
		'Set-Cookie': 'token=' + token,
	})
	res.send('somedata');
});

app.get('/create', (req, res) => {
	console.log('create');
	let token = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.createRefreshToken(token, req.query.username);
	queryRes.then((value) => {
		if (value == true) {
			console.log('new token issued ' + token);
			res.set({
				'Set-Cookie': 'refreshToken=' + token + '; Path=/refresh',
            })
			res.send(token);
		}
	}).catch(e => res.send('format issue'));
})

app.get('/refresh', (req, res) => {
	console.log('refresh');
	let token = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.validateRefreshToken(req.cookies.refreshToken, token);
	queryRes.then((value) => {
		if (value == true) {
			console.log('new token issued ' + token);
			res.set({
				'Set-Cookie': 'refreshToken=' + token + '; Path=/refresh',
			})
			res.send(token);
		}
		else {
			console.log('new token issued failure');
			res.send('no new token issued');
		}
	}).catch(e => res.send('format issue'));
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});