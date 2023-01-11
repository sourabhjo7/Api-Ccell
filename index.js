require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./database')
const fetch = require("node-fetch");
const axios = require('axios').default;

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors
const cors = require("cors");
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
app.use(cors());

app.use(express.json());

require('./models/user');
require('./models/outpass');
require('./models/admin');
require('./models/post');
db.model("User");
db.model("Outpass")
db.model("Admin")
db.model("Post")
app.use(require('./routes/auth'));
app.use(require('./routes/outpass'));
app.use(require('./routes/admin'));
app.use(require('./routes/post'));

app.post("/handleGoogleRedirect", async (req, res) => {
  // get code from url
  // console.log(req.body.code)
  console.log("HGR ------- ", req.body)
  // const code = req.query.code;
  console.log("server 48 | code", req.body.code);
  // get access token

  await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.WEB_CLIENT_ID,
    client_secret: process.env.WEB_CLIENT_SECRET,
    code: req.body.code,
    grant_type: 'authorization_code',
    redirect_uri: "http://localhost:5000/handleGoogleRedirect"
  })
    .then((resp) => {
      const response = JSON.stringify(resp.data)
      console.log("HGR response: " + response)
      res.json({ accessToken: resp.data.access_token, refreshToken: resp.data.refresh_token })
    })
});

app.post("/getValidToken", async (req, res) => {
  try {
    const request = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.WEB_CLIENT_ID,
        client_secret: process.env.WEB_CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log("server 80 | data", data);

    res.json({
      accessToken: data.access_token,
      idToken: data.id_token
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The Server is running on port: ${PORT}`);
})
