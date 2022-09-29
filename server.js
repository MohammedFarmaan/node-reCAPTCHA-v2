const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { stringify } = require("querystring");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/subscribe", async (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({ success: false, msg: "Please select captcha" });
  }

  // Secret
  const Key = "Your API Key";

  // verify Url
  const query = stringify({
    secret: Key,
    response: req.body.captcha,
    remoteIp: req.socket.remoteAddress,
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Request to verifyURL
  const body = await fetch(verifyURL).then((res) => res.json());

  // If request successful
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: "Failed captcha verification" });

  // If request unsuccessful
  return res.json({ success: true, msg: "Captcha passed" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
