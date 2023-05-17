const path = require("path");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var jsonData = require("data.json");

app.set("view engine", "ejs"),
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/home.html"));
    //res.render('home');
  });

// loginשליפת נתונים שהזין המשתמש ב
app.post("/api/login", function (req, res) {
  var data = req.body;
  var username = data.username;
  var password = data.password;
  var user = jsonData.users.findIndex(
    (u) => u.username === username && u.password === password
  );

  console.log(user);

  if (user < 0) res.send("false");
  else res.send("true");
});

// החזרת נתונים על המשתמש כשצריך
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/api/user", urlencodedParser, function (req, res) {
  var username = req.query.user;

  var user = jsonData.users.find((u) => u.username === username);
  //console.log(user)
  res.send(user);
});

//בקשת כניסה לקטלוג
app.get("/api/catalog", function (req, res) {
  var user = req.query.user;
  if (user == null) {
    res.send("NOT_ALLOWD");
  } else {
    res.send(jsonData.flowers.filter((flower) => flower.amount > 0));
  }
});

//כניסה לבקשת ניהול משתמשים
app.get("/api/manage_user", function (req, res) {
  var user_name = req.query.user;
  var user_level = req.query.level;
  if (user_name == null) {
    res.send("NOT_ALLOWD");
  } else {
    var users = res.send(jsonData.users.filter((user) => user.ISactive));
  }
  if (user_level == 1) {
    res.send(users);
  } else {
    var user_no_pass = users.map(User_no_Password);
    res.send(user_no_pass);
  }
});

function User_no_Password(item) {
  var user_no_password = [item.username, item.level].join(" ");
  return user_no_password;
}
//================================================================================

// כשרוצים למחוק משתמש
//ימצא את המשתמש ויעדכן אותו להיות לא פעיל
//אם הוא עובד או קליינט
//ואז יחזיר את רשימת היוזרים המעודכנים
app.get("/api/delete", function (req, res) {
  var user_password = req.query.pass;
  var username = req.query.name;
  //console.log(user_password +" "+ username)
  var user = jsonData.users.find(
    (u) => u.username == username && u.password == user_password
  );
  console.log(user);
  console.log(username + user_password);
  if (user == null) {
    res.send(false);
  } else {
    var user_delete = jsonData.users.findIndex(
      (u) => u.password == user_password && u.username == username
    );
    user.ISactive = false;
    jsonData.users[user_delete].ISactive = false;
  }
  var users = res.send(jsonData.users.filter((u) => u.ISactive)); //נראלי טעות יש כאן פעמיים שליחה
});

//כשמוסיפים משתמש
app.post("/api/newUser", function (req, res) {
  console.log("הגענו להוספת משתמש");
  var uname = req.query.user;
  var data = req.body;
  console.log(data);
  var user = jsonData.users.find((u) => u.username === uname);
  if (user.level != 1 && user.level != 2) res.send(false);
  else {
    jsonData.users.push(data);
    var users = res.send(jsonData.users.filter((u) => u.ISactive));
    //res.send(users)
  }
});

//כשמעדכנים משתמש
app.put("/api/updUser", function (req, res) {
  var uname = req.query.username;
  var password = req.query.password;
  var data = req.body;

  var UpUser = jsonData.users.findIndex(
    (t) => t.password == password && t.username == uname
  );
  if (UpUser >= 0) {
    jsonData.users[UpUser].level = data.level;
    res.send(jsonData.users.filter((u) => u.ISactive));
  } else {
    res.send(false);
  }
});

//ייבוא דפים פשוט
app.get("/catalog", function (req, res) {
  res.render("catalog");
});

app.get("/contact", function (req, res) {
  //console.log("hiiiiiii contantt")
  res.render("contact");
});
app.get("/about", function (req, res) {
  //console.log("hi about")
  res.render("about");
});

// app.get('/NOT_ALLOWD', function(req, res){
//   //console.log("hiiiiiii contantt")
//   res.render("NOT_ALLOWD");
// });

app.get("/manage_user", function (req, res) {
  res.render("manage_user");
});

app.use((req, res, next) => {
  setTimeout(() => next(), 1000);
});

app.listen(4000, () => {
  console.log("localhost:4000");
});
