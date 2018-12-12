require("dotenv").config();
var fs = require('fs')
var file = 'random.txt'
var keys = require('./keys')
var axios = require('axios')
var moment = require('moment');

function concert(artist){
    console.log('Searching for concert:', artist+'\n')
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id="+keys.bands.id)
        .then(function(response){
            
            console.log('The next '+artist+' concert will be:\nVenue: '+response.data[0].venue.name+'\nLocation: '+response.data[0].venue.city+', '+response.data[0].venue.region+', '+response.data[0].venue.country+'\nDate: '+moment(response.data[0].datetime).format('L'))
        })
}
function song(songName){
    console.log('Searching for song:', songName)
}
function movie(movieName){
    console.log('Searching for movie:', movieName)
}

function rand(){
    fs.readFile(file, 'utf8', function(error, data){
        if(error){
            return console.log('This file has been corrupted: \n'+error);
        }
        var list = data.split(',').map(x => x.trim());
        if(list[0] == 'concert-this'){
            concert(list[1])
        }else if(list[0] == 'spotify-this-song'){
            song(list[1])
        }else if(list[0] == 'movie-this'){
            movie(list[1])
        }else{
            console.log('syntax error')
        }
    })
}

if(process.argv[2] == 'concert-this'){
    concert(process.argv[3])
}else if(process.argv[2] == 'spotify-this-song'){
    song(process.argv[3])
}else if(process.argv[2] == 'movie-this'){
    movie(process.argv[3])
}else if(process.argv[2] == 'do-what-it-say'){
    rand()
}else{
    console.log('syntax error')
}