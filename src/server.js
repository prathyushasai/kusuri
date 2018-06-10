var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

app.get('/uploadFile', function(req, res) {
    console.log(req.body);
    console.log(req.body.uploadedFile);
    fs.readFile(req.body.uploadedFile, 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        const text = data;
        const document = {
          content: text,
          type: 'PLAIN_TEXT',
            };

        // Detects the sentiment of the document
        // client
        //     .analyzeSentiment({document: document})
        //     .then(results => {
        //       const sentiment = results[0].documentSentiment;
        //       console.log(`Document sentiment:`);
        //       console.log(`  Score: ${sentiment.score}`);
        //       console.log(`  Magnitude: ${sentiment.magnitude}`);

        //       const sentences = results[0].sentences;
        //       sentences.forEach(sentence => {
        //         console.log(sentence);
        //         console.log(`Sentence: ${sentence.text.content}`);
        //         console.log(`  Score: ${sentence.sentiment.score}`);
        //         console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
        //       });
        //     })
        //     .catch(err => {
        //       console.error('ERROR:', err);
        //     });

        });
    res.send('hi');
  });

app.listen(8080);
module.exports = app;