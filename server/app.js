const express = require('express');
const bodyParser = require('body-parser');
const jwtSimple = require('jwt-simple');
const fs = require('fs');
const app = express();
const PORT = 8081;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let users = [
    {
        id: 1,
        username: 'user1',
        password: 'user1',
        isAdmin: false
    },
    {
        id: 2,
        username: 'user2',
        password: 'user2',
        isAdmin: false
    },
    {
        id: 3,
        username: 'admin',
        password: 'admin',
        isAdmin: true
    }
];

app.post('/get_token', (req, res) => {
    const {username, password} = req.body;
    let user = users.find(u => username === u.username && password === u.password);

    if (user) {
        let token = jwtSimple.encode({
                username: user.username,
                admin: user.isAdmin
            },
            fs.readFileSync('key'), 'RS256');

        res.json({
            success: true,
            err: null,
            token
        });
    } else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
});

app.post('/verify_token', function (req, res) {
    sendDecodedToken(req.body.token, res);
});

app.get('/verify_token', function (req, res) {
    sendDecodedToken(req.query.token, res)
});

function sendDecodedToken(token, res) {
    try {
        const decoded = jwtSimple.decode(token, fs.readFileSync('key.pem'), true);
        res.set('Content-Type', 'text/plain');
        res.send(decoded)
    } catch (e) {
        console.log(e);
        res.set('Content-Type', 'text/plain');
        res.send('Error')
    }
}

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Magic happens on port ${PORT}`);
});
