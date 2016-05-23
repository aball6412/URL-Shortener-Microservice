
/////REMEMBER TO RESEARCH ADDING ENVIRONMENT VARIABLES SO THAT WE DON'T UPLOAD PASSWORDS AND OTHER SENSITIVE INFO TO GITHUB. ALLOW US TO JUST REFERENCE THE ENVIRONMENT VARIABLE IN OUR CODE. EXAMPLE: process.env.PORT. BUT INSTEAD OF .PORT ADD ANOTHER VARIABLE LIKE .MONGO_URL ETC...



var express = require("express");
var app = express();
var validator = require("validator");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;


//Set database connection URL
var dburl = process.env.MONGOLAB_URI || "mongodb://localhost:27017/urlShortenerMicroservice";
var collection;

//Set port variable for production or development
var port = process.env.PORT || 3000;

//Serve the static HTML to the client
app.use("/", express.static(__dirname + "/public"));


//Initialize the database connection once
 MongoClient.connect(dburl, function(err, db) {
        if (err) {
            console.log("Unable to connect to database.");
            throw err;
        }
        
        else {
            console.log("Connection successful.");
            
            collection = db.collection("url");
            
      
        }

}); //End of database connection



//Display homepage screen 
//app.get("/", function(request, response) {
//    
//    response.send();
//    
//});


//Display original and shortened URL after parameter is passed
app.get("/*", function(request, response) {

    //Get the parameter (which is everything after the first slash no matter the character "/*")
    var url = request.params["0"];

    
    //Check to see if URL is valid or not
    if (validator.isURL(url)) {
        
        
            //Check the db to see if it's been used and if not insert
            var match = "yes";

            
            //Create random shortener key
            var key = Math.floor(Math.random() * (10001 - 1) + 1);


            collection.find({ short: key }).toArray(function(err, documents) {


                if (documents.length >= 1) {
                    
                    console.log("That key has already been used"); 
                    
                }
                else {
                    match = "no";
                    collection.insert(
                        {
                            "original": url,
                            "short": key
                        });  
                    console.log("New URL inserted");
                }// End else

            }); //End collection query
            
        

        var display = {
            "Normal URL": url,
            "Shortened URL": key
        }
        
        response.send(display);
        
    } //End big if statement
    
    else {

        var display = {
            "Error": "URL is invalid"
        }
        
        response.send(display);
    }
    
    
    
});


app.listen(port);