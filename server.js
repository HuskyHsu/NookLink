const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');

const items = require('./src/items/index');

const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

// the request handler of the bottender app
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const verify = (req, _, buf) => {
    req.rawBody = buf.toString();
  };
  server.use(bodyParser.json({ verify }));
  server.use(bodyParser.urlencoded({ extended: false, verify }));

  // your custom route
  server.get('/api', (req, res) => {
    res.json({ ok: true });
  });

  server.get('/flex-message', (req, res) => {
    let type = req.query.type;
    let name = req.query.name;
    res.json(items.flex(name))
  });
  
  server.get('/send-id', (req, res) => {
    if (req.query.type === 'SHARE') {
      res.json({ id: process.env.LINE_LIFF_ID_SHARE });
    }
  });

  server.get('/liff/share', (req, res) => {
    const filename = path.join(`${__dirname}/liff/share.html`);
    res.sendFile(filename);
  });

  // route for webhook request
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});