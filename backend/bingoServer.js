const http = require('http');
const app = require('./app');
const port = 8002;
const server = http.createServer(app);
console.log("PORT--->",port)
server.listen(port);


