const express = require("express");
const router = express.Router();
const passport = require("passport");
const async = require("async");
const Event = require("../model/Event");
const Contact = require("../model/Contact");
const isEmpty = require("lodash.isempty");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const requireAuth = passport.authenticate("jwt", {
  session: false,
});

/**
 * @desc Calendar API
 * @method GET
 */
router.get("/calendar/get", requireAuth, async (req, res, next) => {
  if (isEmpty(req.user.identities.google.refreshToken)) {
    res.status(401).json({
      msg: `Not authorized for google`,
    });
  } else {
    const accessToken = req.user.identities.google.refreshToken;
    const oAuth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({
      refresh_token: accessToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oAuth2Client,
    });
    calendar.events.list(
      {
        calendarId: req.user.email,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        maxResults: 30,
        orderBy: "startTime",
      },
      function (err, response) {
        if (err) {
          console.log("Refresh token The API returned an error: " + err);
          return;
        }
        console.log("::::::: ");

        let events = response.data.items;
        console.log("****************************" + JSON.stringify(events))
        async.eachOfSeries(events, function (dataVar, key, callback) {
          Event.findOne(
            {
              summary: dataVar.summary,
              start: dataVar.start["dateTime"],
              end: dataVar.end["dateTime"],
            },
            function (err, event) {
              if (!event) {
                let eventSchema = new Event({
                  googleId: dataVar.id,
                  start: dataVar.start["dateTime"],
                  end: dataVar.end["dateTime"],
                  status: dataVar.status,
                  attendees: dataVar.attendees,
                  creator: dataVar.creator,
                  description: dataVar.description,
                  summary: dataVar.summary,
                  htmlLink: dataVar.htmlLink,
                  hangoutLink: dataVar.hangoutLink,
                  author: {
                    id: req.user._id,
                    givenName: req.user.givenName,
                    familyName: req.user.familyName,
                    calendarId: req.user.email,
                    provider: req.user.identities.google.provider,
                  },
                });
                eventSchema.save(function (err, result) {
                  console.log("New Record Inserted");
                  callback();
                });
              } else {
                Event.findOneAndUpdate(
                  {
                    summary: dataVar.summary,
                    start: dataVar.start["dateTime"],
                    end: dataVar.end["dateTime"],
                  },
                  {
                    start: dataVar.start["dateTime"],
                    end: dataVar.end["dateTime"],
                    status: dataVar.status,
                    creator: dataVar.creator,
                    description: dataVar.description,
                    attendees: dataVar.attendees,
                    summary: dataVar.summary,
                    htmlLink: dataVar.htmlLink,
                    hangoutLink: dataVar.hangoutLink,
                    author: {
                      id: req.user._id,
                      givenName: req.user.givenName,
                      familyName: req.user.familyName,
                      calendarId: req.user.email,
                      provider: req.user.identities.google.provider,
                    },
                  },
                  function (err, result) {
                    if (process.env.NODE_ENV === "development") {
                      console.log("Record Updated");
                    }
                    callback();
                  }
                );
              }
            }
          );
        });
        res.json(events);
      }
    );

  }
});
/**
 * @desc People API
 * @method GET
 */
router.get("/people/get", requireAuth, async (req, res) => {
  const accessToken = req.user.identities.google.refreshToken;
  const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oAuth2Client.setCredentials({
    refresh_token: accessToken,
  });
  const service = google.people({
    version: "v1",
    auth: oAuth2Client,
  });
  service.people.connections.list(
    {
      resourceName: "people/me",
      personFields: "names,emailAddresses,photos,phoneNumbers,organizations",
    },
    (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const connections = res.data.connections;
      async.eachOfSeries(connections, function (dataVar, key, callback) {
        Contact.findOne(
          {
            etag: dataVar.etag,
          },
          (err, contact) => {
            if (!contact) {
              Contact.create({
                etag: dataVar.etag,
                givenName: dataVar.names[0].givenName ? dataVar.names[0].givenName : "",
                familyName: dataVar.names[0].familyName ? dataVar.names[0].familyName : "",
                picture: dataVar.photos[0].url,
                phone: dataVar.phoneNumbers ? dataVar.phoneNumbers[0].canonicalForm : "",
                email: dataVar.emailAddresses ? dataVar.emailAddresses[0].value : "",
                company: dataVar.organizations ? dataVar.organizations[0].name : "",
                owner: {
                  id: req.user._id,
                  givenName: req.user.givenName,
                  familyName: req.user.familyName,
                  email: req.user.email,
                },
              });
              if (err)
                return console.error("The API returned an error: " + err);
              if (process.env.NODE_ENV === "development") {
                console.log("Record is inserted");
              }
              callback();
            } else {
              Contact.findOneAndUpdate(
                {
                  etag: dataVar.etag,
                  givenName: dataVar.names[0].givenName ? dataVar.names[0].givenName : "",
                  familyName: dataVar.names[0].familyName ? dataVar.names[0].familyName : "",
                  picture: dataVar.photos[0].url,
                  phone: dataVar.phoneNumbers ? dataVar.phoneNumbers[0].canonicalForm : "",
                  email: dataVar.emailAddresses ? dataVar.emailAddresses[0].value : "",
                  company: dataVar.organizations ? dataVar.organizations[0].name : "",
                },
                {
                  owner: {
                    id: req.user._id,
                    givenName: req.user.givenName,
                    familyName: req.user.familyName,
                    email: req.user.email,
                  },
                },
                (err) => {
                  if (err)
                    return console.error("The API returned an error: " + err);
                  if (process.env.NODE_ENV === "development") {
                    console.log("Record is updated");
                  }
                  callback();
                }
              );
            }
          }
        );
      });
    }
  );
});

/**
 * @desc Google OAuth callback
 * @method GET
 */
router.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
    accessType: "offline",
  }),
  function (req, res) {
    return res.status(201).json({
      msg: 'Auth complete',
      token: req.user,
      success: true
    });
  }
);

/**
 * @desc Google OAuth route
 * @method GET
 */
router.get(
  "/auth",
  function (req, res, next) {
    next();
  },
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/contacts.readonly",
    ],
    accessType: "offline",
    prompt: 'consent',
    session: true,
  })
);

module.exports = router;
