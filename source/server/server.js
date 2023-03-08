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

app.get('/auth', (req, res) => {
	res.send('EXPRESS POST CREATE');
});

app.get('/token', (req, res) => {
	console.log(req.query.username);
	let token = jwt.sign({ username: req.query.username }, secret);
	res.set({
		'Set-Cookie': 'token=' + token,
	})
	res.send('somedata');
});

// create a refresh and access token based on username
app.get('/create', (req, res) => {
	console.log('create');
	let refreshToken = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.createRefreshToken(refreshToken, req.query.username);
	queryRes.then(value => {
		if (value == true) {
			console.log('new token issued ' + refreshToken);
			let accessToken = jwt.sign({ username: req.query.username }, secret, { expiresIn: 10 });
			res.cookie('refreshToken', refreshToken, { path: '/refresh' });
			res.cookie('accessToken', accessToken);
			res.send(refreshToken + '<br/>' + accessToken);
		}
	}).catch(e => {
		console.log(e);
		res.send('format issue');
	});
})

// verify if refresh token is valid and issue a new refresh and access token
app.get('/refresh', (req, res) => {
	console.log('refresh');
	let refreshToken = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.validateRefreshToken(req.cookies.refreshToken, refreshToken);
	queryRes.then(queryStatus => {
		if (queryStatus.successStatus == true) {
			console.log('new token issued ' + refreshToken);
			let accessToken = jwt.sign({ username: queryStatus.username }, secret, {expiresIn: 10 });
			res.cookie('refreshToken', refreshToken, { path: '/refresh' });
			res.cookie('accessToken', accessToken);
			res.send(refreshToken + '<br/>' + accessToken);
		}
		else {
			console.log('new token issued failure');
			res.send('no new token issued');
		}
	}).catch(e => {
		console.log(e);
		res.send('format issue');
	});
})

app.get('/secret', (req, res) => {
	console.log('secret');
	jwt.verify(req.cookies.accessToken, secret, (err, decoded) => {
		if (err) {
			res.set('Cache-Control', 'no-store');
			res.send('UNAUTHORIZED');
		}
		else {
			res.set('Cache-Control', 'no-store');
			res.send('AUTHORIZED for ' + decoded.username);
		}
	});
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});