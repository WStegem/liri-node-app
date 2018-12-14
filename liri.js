require("dotenv").config();
var fs = require('fs')
var file = 'random.txt'
var keys = require('./keys')
var axios = require('axios')
var moment = require('moment');
var Spotify = require('node-spotify-api')
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
  });

function concert(artist){
    console.log('Searching for concert:', artist+'\n')
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id="+keys.bands.id)
        .then(function(response){
            
            console.log('The next '+artist+' concert will be:\nVenue: '+response.data[0].venue.name+'\nLocation: '+response.data[0].venue.city+', '+response.data[0].venue.region+', '+response.data[0].venue.country+'\nDate: '+moment(response.data[0].datetime).format('L'))
        })
}
function song(songName){
    console.log('Searching for song:', songName+'\n')

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var artistList =''
        for(i=0;i<data.tracks.items[0].artists.length;i++){
            if(i<data.tracks.items[0].artists[i].name-1){
                artistList += data.tracks.items[0].artists[i].name+', '
            }else if(i==data.tracks.items[0].artists.length-1){
            artistList += data.tracks.items[0].artists[i].name
            }
        }
        console.log('Artist: '+artistList+' \nSong: '+data.tracks.items[0].name+'\nAlbum: '+data.tracks.items[0].album.name+'\nPreview: '+data.tracks.items[0].preview_url)
    })
}

function movie(movieName){
    console.log('Searching for movie:', movieName)
    var ID
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&s=" + movieName)
    .then(function(response){
        ID = response.data.Search[0].imdbID
        axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&i=" + ID)
            .then(function(response){
                let imdb = response.data.Ratings.find(obj => obj.Source == 'Internet Movie Database')
                let rotten = response.data.Ratings.find(obj => obj.Source == 'Rotten Tomatoes')
                console.log('Movie name: '+response.data.Title+'\nReleased year: '+response.data.Year+'\nIMDB rating :'+imdb.Value+'\nRotten Tomatoes rating: '+rotten.Value+'\nCountry: '+response.data.Country+'\nLanguage: '+response.data.Language+'\nPlot: '+response.data.Plot+'\nActors: '+response.data.Actors)
    }) })
    console.log()
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