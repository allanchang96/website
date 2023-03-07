'use strict'

import db from 'pg';

const pool = new db.Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
});

/* 
 * refresh_tokens table columns
 * $1 token_id varchar(100)
 * $2 username varchar(32)
 * $3 ttl timestamp
 * $4 revoked boolean
 */

const getOldToken = {
    name: 'get-old-token',
    text: `select *
            from refresh_tokens
            where token_id = $1
            and ttl > now()`
}

const updateOldToken = {
    name: 'update-old-token',
    text: `update refresh_tokens
            set revoked = true
            where token_id = $1`
}

const revokeUserTokens = {
    name: 'revoke-user-tokens',
    text: `update refresh_tokens
            set revoked = true
            where username = $1`
}

/* $1 token-id varchar(100)
 * $2 username varchar(32)
 */
const insertToken = {
    name: 'insert-token-ttl',
    text: `insert into refresh_tokens
            values ($1, $2, now() + interval '1 hour', false)`
}

/* $1 token-id varchar(100)
 * $2 username varchar(32)
 * $3 ttl timestamp
 */
const insertTokenTtl = {
    name: 'insert-token-ttl',
    text: `insert into refresh_tokens
            values ($1, $2, $3, false)`
}

export async function createRefreshToken(tokenId, username) {
    const client = await pool.connect();
    await client.query(insertToken, [tokenId, username]);
    return true;
}

export async function validateRefreshToken(oldTokenId, newTokenId) {
    // successStatus indicates if new token was issued successfully
    let successStatus = true;

    const client = await pool.connect();
    await client.query('BEGIN');
    console.log(oldTokenId);
    // Get old token information
    const oldTokenInfo = await client.query(getOldToken, [oldTokenId]);
    console.log(oldTokenInfo);
    if (oldTokenInfo.rowCount == 1) {
        const username = oldTokenInfo.rows[0].username;
        const ttl = oldTokenInfo.rows[0].ttl;
        const revoked = oldTokenInfo.rows[0].revoked;

        // Check if has yet to been revoked
        if (revoked == false) {
            // revoke old token
            await client.query(updateOldToken, [oldTokenId]);
            // issue new token
            await client.query(insertTokenTtl, [newTokenId, username, ttl]);
        }
        else {
            // refresh token was reused
            // revoke all of user's tokens
            await client.query(revokeUserTokens, [username]);
            successStatus = false;
        }
    }
    else {
        successStatus = false;
    }
    await client.query('COMMIT');
    return successStatus;
}

export function query(text, params, callback) {
    return pool.query(text, params, callback);
};

/*let token = crypto.randomBytes(64).toString('base64');
db.query('INSERT INTO refresh_tokens VALUES ($1, $2)', [token, req.query.username], () => {
    console.log('inserted ' + req.query.username);
});*/