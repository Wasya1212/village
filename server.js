var app = require('./express')();
var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || 8080;

// get all routes
require('./routes/index')(app);

// error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(port, function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + " " + addr.port);
});
