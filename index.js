'use strict'

const express = require('express')
const renderer = require('./renderer')

const port = process.env.PORT || 5500;

const app = express()

// Configure.
app.disable('x-powered-by')

// Render url.
app.use(function (req, res, next) {
    if (!req.query.url) {
        return res.status(400).send('Search with url parameter. For eaxample, ?url=http://yourdomain');
    }
    renderer.loadPage(req.query.url, function (status, content) {
        res.status(status).send(content);
    });
});

// Error page.
app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Oops, An expected error seems to have occurred.')
});

app.listen(port);
