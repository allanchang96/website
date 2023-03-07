'use strict'

import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import * as db from './db.js'

const app = express();
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

app.get('/secret', (req, res) => {
	console.log(req.cookies);
});

app.get('/create', (req, res) => {
	console.log('create');
	let token = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.createRefreshToken(token, req.query.username);
	queryRes.then((value) => {
		if (value == true) {
			console.log('new token issued ' + token);
			res.send(token);
        }
    })
});

app.get('/refresh', (req, res) => {
	console.log('refresh');
	let token = crypto.randomBytes(64).toString('base64url');
	const queryRes = db.validateRefreshToken(req.query.tokenId, token);
	queryRes.then((value) => {
		if (value == true) {
			console.log('new token issued ' + token);
			res.send(token);
		}
		else {
			console.log('new token issued failure');
			res.send('no new token issued');
        }
	});
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});