
/////REMEMBER TO RESEARCH ADDING ENVIRONMENT VARIABLES SO THAT WE DON'T UPLOAD PASSWORDS AND OTHER SENSITIVE INFO TO GITHUB. ALLOW US TO JUST REFERENCE THE ENVIRONMENT VARIABLE IN OUR CODE. EXAMPLE: process.env.PORT. BUT INSTEAD OF .PORT ADD ANOTHER VARIABLE LIKE .MONGO_URL ETC...



var express = require("express");
var app = express();
var validator = require("validator");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

var url = "mongodb://localhost:27017/urlShortenerMicroservice"


//Set port variable for production or development
var port = process.env.PORT || 3000;




//Display homepage screen 
app.get("/", function(request, response) {
    
    
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Unable to connect to database.");
            throw err;
        }
        
        else {
            console.log("Connection successful.");
            
            //Do some work
            
            db.collection("url").find().toArray(function(err, documents) {
                
                console.log(documents);
            });
            
      
            
           db.close();
        }

    }); //End of database connection
    
    
    response.send("<html><head></head><body><h1>Free Code Camp API Basejump</h1><h2>Url Shortener Microservice</h2></body></html>");
    
});


//Display original and shortened URL after parameter is passed
app.get("/*", function(request, response) {
    
    //Get the parameter (which is everything after the first slash no matter the character "/*")
    var url = request.params["0"];
    
    //Check to see if URL is valid or not
    if (validator.isURL(url)) {

        var display = {
            "Normal URL": url,
            "Shortened URL": "still working on it"
        }
        
        response.send(display);
        
    }
    
    else {

        var display = {
            "Error": "URL is invalid"
        }
        
        response.send(display);
    }
    
    //Google URL Shortener API key
    //AIzaSyBqSTVVlJSQnZVti7N2hxyCt_GhqR9vznc
    
    
});


app.listen(port);