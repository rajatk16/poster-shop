const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
const server = require("http").createServer(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

let directory;

fs.readFile("./directory.json", "utf-8", (err, data) => {
  directory = JSON.parse(data);
  if (err) {
    throw err;
  }
});

app.get("/search", (req, res) => {
  let = results = directory.reduce((acc, file) => {
    if (file.tags.indexOf(req.query.q) !== -1) {
      acc.push({
        id: file.id,
        title: file.title,
        thumb: "/public/images/".concat(file.thumb),
        price: file.price
      });
    }
    return acc;
  }, []);
  res.send(results);
});

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use("/public", express.static(path.join(__dirname, "public")));

let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Listening on PORT".concat(port));
});