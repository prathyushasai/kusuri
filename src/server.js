var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var cors = require('cors');

// const language = require('@google-cloud/language');
// const client = new language.LanguageServiceClient();
app.use(cors());

app.get('/', function(req, res) {
  res.json('you did it');
});

var absolutist = ['all', 'always', 'every', 'just', 'only', 'never', 'none', 'no', 'not', 'must',
'cannot', 'can\'t', 'complete', 'constant', 'full', 'whole', 'everyone', 'no one'];
var false_positives = ['not', 'almost', 'sometimes', 'nearly', 'few', 'usually', 'much',
'generally', 'often', 'many', 'some'];
var first = ['I', 'i', 'me', 'Me', 'myself', 'Myself'];
var pronouns = ['she', 'her', 'She', 'Her', 'they', 'They', 'him', 'he', 'He', 'Him', 'them', 'Them'];
var output = {tdata: '', sentiment: 0, likelihood: 'Error in Processing Data'};
function decideLikelihood(sentiment, absolute, first, length) {
  var normalized = {senti: sentiment / length, absol: absolute / length, fir: first / length};
  var categorize = 0;
  if (normalized.senti < -0.5) {
    categorize+=1
  }
  if (normalized.absol > 0.6) {
    categorize+=1
  }
  if (normalized.first > 0.7) {
    categorize+=1
  }

  switch(categorize) {
    case 1:
      return 'Low. Read more info here: https://www.healthline.com/health/depression/risk-factors';
    case 2:
      return 'Medium. Read more info here: https://www.healthline.com/health/depression/risk-factors';
    case 3:
      return 'High. Read more info here: https://www.healthline.com/health/depression/risk-factors';
    default:
      return 'None. Read more info here: https://www.healthline.com/health/depression/risk-factors';
  }
};



app.get('/uploadFile', function(req, res) {
    console.log('received something');
    res.send('hi');
    console.log(req.query.uploadedFile);
    console.log(req.query.uploadedFile.content);
    var realPath = req.query.uploadedFile.replace("C:\\fakepath\\", "~/");
    fs.readFile(realPath, 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        const text = data;
        output.tdata = text;
        const document = {
          content: text,
          type: 'PLAIN_TEXT',
            };

      // Detects the sentiment of the document
        client
            .analyzeSentiment({document: document})
            .then(results => {
              const sentiment = results[0].documentSentiment;
              var count = 0;
              var length = 0;
              var absol_words = 0;
              var first = 0;
              const sentences = results[0].sentences;
              sentences.forEach(sentence => {
                var absol_bool = false;
                var first_bool = false;
                for (i = 0; i < absolutist.length; i++) {
                  if (sentence.text.content.indexOf(absolutist[i]) !== -1 && sentence.text.content.indexOf(absolutist[i]) == -1) {
                    absol_bool = true;
                  }
                  if (sentence.text.content.indexOf(first[i])) {
                    first_bool = true;
                  }
                }
                if (absol_bool) {
                  absol_words += 1;
                }
                if (first_bool) {
                  first += 1
                }

                length += 1;
                count += sentence.sentiment.score;
              });

              const likeiness = decideLikelihood(count, absol_words, first, length);

              output.sentiment = count / (1.0 * length);
              output.likelihood = likeiness;
              console.log(absolutist / length);
              console.log(first / length);

              console.log(output.likelihood);
              console.log(output.sentiment);
              console.log(output.tdata);
            })
            .catch(err => {
              console.error('ERROR:', err);
            });
        });
    res.send('hi');
    res.send(output);
  });

app.get('/getSign', function(req, res) {
    console.log('received something');
    res.send('Sign success!');
    const express = require('express')
    , passport = require('passport')
    , session = require('express-session')
    , docusign = require('docusign-esign')
    , moment = require('moment')
    , fs = require('fs-extra')
    , path = require('path')
    , {promisify} = require('util') // http://2ality.com/2017/05/util-promisify.html
    ;

const app = express()
    , port = process.env.PORT || 3000
    , host = process.env.HOST || 'localhost'
    , hostUrl = 'http://' + host + ':' + port
    , clientID = process.env.DS_CLIENT_ID || 'fbf345f4-e421-4c6c-8f8a-188d40199586'
    , clientSecret = process.env.DS_CLIENT_SECRET || 'null'
    , signerEmail = process.env.DS_SIGNER_EMAIL || 'prathyushasai@gmail.com'
    , signerName = process.env.DS_SIGNER_NAME || '{USER_NAME}'
    , templateId = process.env.DS_TEMPLATE_ID || '{TEMPLATE_ID}'
    , baseUriSuffix = '/restapi'
    , testDocumentPath = '../demo_documents/test.pdf'
    , test2DocumentPath = '../demo_documents/battle_plan.docx'
    ;

let apiClient // The DocuSign API object
  , accountId // The DocuSign account that will be used
  , baseUri // the DocuSign platform base uri for the account.
  , eg // The example that's been requested
  ;

// Configure Passport
passport.use(new docusign.OAuthClient({
    sandbox: true,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: hostUrl + '/auth/callback',
    state: true // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
  },
  function (accessToken, refreshToken, params, user, done) {
    // The params arg will be passed additional parameters of the grant.
    // See https://github.com/jaredhanson/passport-oauth2/pull/84
    //
    // Here we're just assigning the tokens to the user profile object but we
    // could be using session storage or any other form of transient-ish storage
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    // Calculate the time that the token will expire
    user.expires = moment().add(user.expiresIn, 's');
    return done(null, user);
  }
));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {done(null, user)});
passport.deserializeUser(function(obj, done) {done(null, obj)});

// Configure the webserver
app.use(session({
  secret: 'secret token',
  resave: true,
  saveUninitialized: true
}))
.use(passport.initialize())
.use(passport.session())
/* Home page */
.get('/', function (req, res) {
  res.send(`<h2>Home page</h2>
<h3><a href="/go?eg=1">Send Envelope via email</a></h3>
<h3><a href="/go?eg=2">Embeddded Signing Ceremony</a></h3>
<h3><a href="/go?eg=3">Send envelope using a template</a></h3>
<h3><a href="/go?eg=4">Embedded Sending</a></h3>
<h3><a href="/go?eg=5">Embedded DocuSign console</a></h3>
<h3><a href="/go?eg=6">List multiple envelopes' status</a></h3>
<h3><a href="/go?eg=7">Get an envelope's status</a></h3>
<h3><a href="/go?eg=8">List an envelope's recipients</a></h3>
<h3><a href="/go?eg=9">Download an envelope's document(s)</a></h3>
`)})
// ########################################################
// ########################################################
/* Page for starting OAuth Authorization Code Grant */
.get('/auth', function (req, res, next) {
  passport.authenticate('docusign')(req, res, next);
})
/* Page for handling OAuth Authorization Code Grant callback */
.get('/auth/callback', [dsLoginCB1, dsLoginCB2])
/* Page to receive pings from the DocuSign embedded Signing Ceremony */
.get('/dsping', dsPingController)
/* Middleware: ensure that we have a DocuSign token. Obtain one if not. */
/*             checkToken will apply to all subsequent routes. */
.use(checkToken)
/* Page to execute an example */
.get('/go', goPageController)

/* Start the web server */
if (clientID === 'fbf345f4-e421-4c6c-8f8a-188d40199586') {
  console.log(`PROBLEM: You need to set the Client_ID (Integrator Key), and perhaps other settings as well. You can set them in the source or set environment variables.`);
} else {
  app.listen(port, host, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Ready! Open ${hostUrl}`);
  });
}
/**
 * Page controller for processing the OAuth callback
 */
function dsLoginCB1 (req, res, next) {
  passport.authenticate('docusign', { failureRedirect: '/auth' })(req, res, next)
}
function dsLoginCB2 (req, res, next) {
  console.log(`Received access_token: ${req.user.accessToken.substring(0,15)}...`);
  console.log(`Expires at ${req.user.expires.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
  // If an example was not requested, redirect to home
  if (req.session.eg) {res.redirect('/go')
  } else {res.redirect('/')}
}

// #############################################################

// Passport configuration includes a callback method to save the returned 
// Access Token, Refresh Token, and expiration information
passport.use(new docusign.OAuthClient({
    sandbox: true,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: hostUrl + '/auth/callback',
    state: true // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
  },
  function (accessToken, refreshToken, params, user, done) {
    // The params arg will be passed additional parameters of the grant.
    // See https://github.com/jaredhanson/passport-oauth2/pull/84
    //
    // Here we're just assigning the tokens to the user profile object but we
    // could be using session storage or any other form of transient-ish storage
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    // Calculate the time that the token will expire
    user.expires = moment().add(user.expiresIn, 's');
    return done(null, user);
  }
));

// #############################################################

/**
 * Page controller for executing an example.
 * Uses the session.eg saved parameter
 */
function goPageController (req, res, next) {
  // getting the API client ready
  apiClient = new docusign.ApiClient();
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + req.user.accessToken);

  // The DocuSign Passport strategy looks up the user's account information via OAuth::userInfo.
  // See https://developers.docusign.com/esign-rest-api/guides/authentication/user-info-endpoints
  // We want the user's account_id, account_name, and base_uri
  // A user can (and often) belongs to multiple accounts.
  // You can search for a specific account the user has, or
  // give the user the choice of account to use, or use
  // the user's default account. This example used the default account.
  //
  // The baseUri changes rarely so it can (and should) be cached.
  //
  // req.user holds the result of DocuSign OAuth::userInfo and tokens.
  getDefaultAccountInfo(req.user.accounts)
  apiClient.setBasePath(baseUri); // baseUri is specific to the account
  docusign.Configuration.default.setDefaultApiClient(apiClient);
  // Execute an example.
    // The DocuSign Passport strategy looks up the user's account information via OAuth::userInfo.
  // See https://developers.docusign.com/esign-rest-api/guides/authentication/user-info-endpoints
  // We want the user's account_id, account_name, and base_uri
  // A user can (and often) belongs to multiple accounts.
  // You can search for a specific account the user has, or
  // give the user the choice of account to use, or use
  // the user's default account. This example used the default account.
  //
  // The baseUri changes rarely so it can (and should) be cached.
  //
  // req.user holds the result of DocuSign OAuth::userInfo and tokens.
  getDefaultAccountInfo(req.user.accounts)
  apiClient.setBasePath(baseUri); // baseUri is specific to the account

// ###################################################################
// ###################################################################

/**
 * Set the variables accountId and baseUri from the default
 * account information.
 * @param {array} accounts Array of account information returned by
 *        OAuth::userInfo
 */
function getDefaultAccountInfo(accounts){
  let defaultAccount = accounts.find ((item) => item.is_default);
  console.log (`Default account "${defaultAccount.account_name}" (${defaultAccount.account_id})`);
  accountId = defaultAccount.account_id;
  baseUri =  `${defaultAccount.base_uri}${baseUriSuffix}`
}
} });

app.listen(8080, () => console.log('Server running on port 8080!'))
module.exports = app;