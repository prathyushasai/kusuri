var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      fs.readFile(files.filetoupload.name, 'utf8', function(err, data) {  
        if (err) throw err;
        console.log(data);
        const text = data;
        const document = {
          content: text,
          type: 'PLAIN_TEXT',
        };

      // Detects the sentiment of the document
        client
            .analyzeSentiment({document: document})
            .then(results => {
              const sentiment = results[0].documentSentiment;
              console.log(`Document sentiment:`);
              console.log(`  Score: ${sentiment.score}`);
              console.log(`  Magnitude: ${sentiment.magnitude}`);

              const sentences = results[0].sentences;
              sentences.forEach(sentence => {
                console.log(sentence);
                console.log(`Sentence: ${sentence.text.content}`);
                console.log(`  Score: ${sentence.sentiment.score}`);
                console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
              });
            })
            .catch(err => {
              console.error('ERROR:', err);
            });
      });
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);