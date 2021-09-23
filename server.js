// let addr = 'http://localhost:8080/documentation.html'



// imports the http module
// ===================================================
const http = require('http'),

// import the fs module
  fs = require('fs'),

// import the url module
  url = require('url');

// .createServer is the function from the http module
// (request, response) the two arguments of the function passed into createServer
http.createServer((request, response) => {

  // declared addr variable, which has been assigned the function request.url which is the first argument from the create server function
  let addr = 'http://localhost:8080/documentation.html',

  // url parse function is used on the addr variable and the results are set to new variable q
  q = url.parse(addr, true),

  // filepath
  filePath = 'C\Users\Florian\Desktop\CF\movie_api';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.'');
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data)) => {
    if (err) {
      throw err;
    }
  }

// lstens to a responseon port 8080
}).listen(8080);
console.log('My first Node test server is running on Port 8080.');
