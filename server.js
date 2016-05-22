var express = require("express");
var app = express();

var port = process.env.PORT || 3000;


app.get("/", function(request, response) {
    
    console.log("Server is working");
    
    response.send("<html><head></head><body><h1>Free Code Camp API Basejump</h1><h2>Url Shortener Microservice</h2></body></html>")
    
});


app.listen(port);