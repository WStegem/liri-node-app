require("dotenv").config();
var fs = require('fs')
var file = 'random.txt'
var keys = require('./keys')

function concert(artist){
    console.log('concert', artist)
}
function song(songName){
    console.log('song', songName)
}
function movie(movieName){
    console.log('movie', movieName)
}

function rand(){
    fs.readFile(file, 'utf8', function(error, data){
        if(error){
            return console.log('and... death');
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