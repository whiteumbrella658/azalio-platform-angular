const express = require("express");
const app = express();
var path = require("path");
const compression = require('compression')
app.use(compression())
const port = process.env.PORT ? process.env.PORT : 4040;

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use (function (req, res, next) {
  // If request is already secured (https) or if the app is run
  // locally (BLUEMIX_REGION variable exists on cloud only),
  // then ignore it. Otherwise, redirect to https.
  if (req.secure || process.env.BLUEMIX_REGION === undefined) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use(express.static(__dirname + "/dist"));

app.get("/[^.]+$", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

let fs = require("fs");
const configurationFileSrc = "./src/assets/configuration.prod.js";
const configurationFileDestination = "./dist/assets/configuration.js";

let appEnvironment = process.env.AppEnvironment;
let backendURL = process.env.BE_URL;
appEnvironment = appEnvironment ? appEnvironment : "local";
backendURL = backendURL ? backendURL : "localhost:4200";

const environmentVariables = {
  appEnvironment: {
    placeholder: /{AppEnvironment}/g,
    value: process.env.AppEnvironment || "local",
  },
  backendURL: {
    placeholder: /{BE_URL}/g,
    value: process.env.BE_URL || "localhost:3001",
  },
  apiKey: {
    placeholder: /{API_KEY}/g,
    value:
      process.env.firebaseConfig_apiKey ||
      "AIzaSyDhOZkai1kgQoTWgc8fhGu3YxTlzl25E6E",
  },
  authDomain: {
    placeholder: /{AUTH_DOMAIN}/g,
    value:
      process.env.firebaseConfig_authDomain || "azal-6f058.firebaseapp.com",
  },
  projectId: {
    placeholder: /{PROJECT_ID}/g,
    value: process.env.firebaseConfig_projectId || "azal-6f058",
  },
  storageBucket: {
    placeholder: /{STORAGE_BUCKET}/g,
    value: process.env.firebaseConfig_storageBucket || "azal-6f058.appspot.com",
  },
  messagingSenderId: {
    placeholder: /{MESSAGING_SENDER_ID}/g,
    value: process.env.firebaseConfig_messagingSenderId || "162682787316",
  },
  appId: {
    placeholder: /{APP_ID}/g,
    value:
      process.env.firebaseConfig_appId ||
      "1:162682787316:web:67b0c7e59b28b8967095a1",
  },
  measurementId: {
    placeholder: /{MEASUREMENT_ID}/g,
    value: process.env.firebaseConfig_measurementId || "G-NGMQLK2794",
  },
};

fs.readFile(configurationFileSrc, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  // console.log("data: ", data);
  let result = Object.keys(environmentVariables).reduce(
    (acc, current) =>
      acc.replace(
        environmentVariables[current].placeholder,
        environmentVariables[current].value
      ),
    data
  );

  // let result = data.replace(/{AppEnvironment}/g, appEnvironment);
  // result = result.replace(/{BE_URL}/g, backendURL);
  console.log("ENV VALUES: ", result);

  fs.writeFile(configurationFileDestination, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});

app.listen(process.env.PORT || 4040);
