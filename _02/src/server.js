const express = require('express');
const app = express();
const routes = require('./routes');

// define engine como html, comum quando node precisa usar o html
app.engine('html', require('ejs').renderFile);

// usando template engine
app.set('view engine', 'html');

//habilitar arquivos statics
app.use(express.static("public"));

// usar o request.body
app.use(express.urlencoded({extended: true}));

// routes
app.use(routes);

app.listen(3000, () => console.log('started server!'))