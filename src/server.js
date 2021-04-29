const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");

// define engine como html, comum quando node precisa usar o html
app.engine("html", require("ejs").renderFile);

// usando template engine
app.set("view engine", "html");

// Mudar a localização da pasta views
app.set("views", path.join(__dirname, "views"));

//habilitar arquivos statics
app.use(express.static("public"));

// usar o request.body
app.use(express.urlencoded({ extended: true }));

// routes
app.use(routes);

app.listen(process.env.PORT || 3000, () => console.log("started server!"));
