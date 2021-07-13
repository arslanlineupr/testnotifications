var express = require("express"),
  path = require("path"),
  fs = require("fs");

var compression = require("compression");
var app = express();
var staticRoot = __dirname + "/dist/angular-push/";

var env = process.env.NODE_ENV || "production";

app.set("port", process.env.PORT || 80);

app.use(compression());

app.get("/wonderpush-worker-loader.min.js", function (req, res, next) {
  const options = {
    root: path.join(__dirname, "/dist/angular-push/"),
    dotfiles: "deny",
    headers: {
      "Content-Type": "application/javascript",
    },
  };
  const fileName = req.params.name;
  res.sendFile(__dirname + "/wonderpush-worker-loader.min.js", options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.get("/wonderpush.min.html", function (req, res, next) {
  const options = {
    root: path.join(__dirname, "/dist/angular-push/"),
    dotfiles: "deny",
    headers: {
      "Content-Type": "text/html",
    },
  };
  const fileName = req.params.name;
  res.sendFile(__dirname + "/dist/angular-push/wonderpush.min.html", options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.use(function (req, res, next) {
  var accept = req.accepts("html", "json", "xml");
  if (accept !== "html") {
    return next();
  }
  var ext = path.extname(req.path);
  if (ext !== "") {
    return next();
  }
  fs.createReadStream(staticRoot + "index.html").pipe(res);
});

app.use(express.static(staticRoot));

app.listen(app.get("port"), function () {
  console.log("app running on port", app.get("port"));
});
