const express = require("express");
const path = require("path");
const request = require("request");
const bodyParser = require("body-parser");

const PORT = 4000;

const app = express();

app.use(express.static(path.join(__dirname, "assets")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var Bible = [];

const Olumide = callback => {
  request(
    {
      url: `http://dbt.io/library/book?key=753ea937db0c1caf67783b7e015564af&dam_id=ENGESV&v=2`,
      json: true
    },
    (error, response, body) => {
      if (error) {
        callback("Unable to fetch data, Please Refresh the page");
      }
      if (Array.isArray(body)) {
        callback(undefined, body);
      }
    }
  );
};
Olumide((errorMessage, body) => {
  if (errorMessage) {
    console.log(errorMessage);
    Bible.books.push(errorMessage);
  } else {
    body.map(bookObj => {
      chapters = [];
      chapters.push(...(bookObj.chapters.split(',')))
      id = [];
      id.push(...(bookObj.book_id.split(',')))
      Bible.push({
        name: bookObj.book_name,
        chapters,
        id
      });
    });
    console.log(JSON.stringify(Bible, undefined, 2));
  }
});

app.get("/", (req, res) => {
  res.render("index", {
    Bible
  });
});

app.listen(PORT, () => {
  console.log(`Bible App now running on PORT: ${PORT}`);
});
