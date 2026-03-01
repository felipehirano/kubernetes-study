const http = require('node:http');

const hostname = '0.0.0.0';
const port = 3000;
const name = process.env.NAME;
const age = process.env.AGE;

const server = http.createServer((req, res) => {
  res.statusCode = 200; 
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Hello World, my name is ${name} and I'm ${age} years old!`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
