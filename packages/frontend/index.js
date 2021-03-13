const express = require('express');
const fallback = require('express-history-api-fallback');
const fs = require('fs');

const app = express();
const root = `${__dirname}/dist`;

app.use(express.static(root));
app.use(fallback('index.html', { root }));

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Server started on port ${port}.`);
