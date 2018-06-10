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
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end('Hello World!\n');
    res.send('hi');
    console.log(req.body);
    console.log(req.body.uploadedFile);
    fs.readFile(req.body.uploadedFile, 'utf8', function(err, data) {
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
});

app.listen(8080, () => console.log('Server running on port 8080!'))
module.exports = app;