
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
            console.log("Unable to connect to database: " + dburl);
            throw err;
        }
        
        else {
            console.log("Connection successful to: " + dburl);
            
            collection = db.collection("url");
            
        }

}); //End of database connection


//Display original and shortened URL after parameter is passed
app.get("/*", function(request, response) {

    //Get the parameter (which is everything after the first slash no matter the character "/*")
    var url = request.params["0"];

    
    //Check to see if URL is valid or not
    if (validator.isURL(url)) {
        
            //Create random shortener key
            var key = Math.floor(Math.random() * (10001 - 1) + 1);


            collection.find({ short: key }).toArray(function(err, documents) {

                if(err) throw err;
                
                if (documents.length >= 1) {
                    
                    console.log("That key has already been used"); 
                    
                }
                else {
 
                    collection.insert(
                        {
                            "original": url,
                            "short": key
                        });  
                    console.log("New URL inserted");
                }// End else

            }); //End collection query
            
        

        var display = {
            "Normal_URL": url,
            "Shortened_URL": key
        }
        
        response.send(display);
        
    } //End big if statement
    
    else {
        // Since not a valid URL check to see if valid short URL
        var key = Number(request.params[0]);
        
        collection.find({ short: key }).toArray(function(err, documents) {
            
            if(err) throw err;
            
            //If there is a database match then redirect to URL
            if (documents.length >= 1) {
               
                var redirectUrl = documents[0].original;
                var check = redirectUrl.slice(0, 4);
                
                //Make sure that http is prefix so we can properly redirect
                if (check != "http") {
                    redirectUrl = "http://" + redirectUrl;
                }
                  
                response.redirect(redirectUrl);

            }
            
            else {
                
                var display = {
                    "Error": "URL is invalid"
                }
                
                response.send(display);
                
            } //End else
            
        }); //End db query
 
    } //End big else
    
    
    
});


app.listen(port);