#!/usr/bin/env node
const $ = require('./index2')(true);
const express = include('express');
const app = express();

app.get('/', (req, res) => {
  res.send('success');
});

app.listen(3000);