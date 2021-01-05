var express = require('express');
var serve_static = require('serve-static');
var http = require('http');
var fs = require('fs');

var app = express();
var cors = require('cors');
app.use(cors());

var serveur = http.Server(app);
serveur.listen(8080, function(){});

let database = JSON.parse(fs.readFileSync('pokedex.json'))

app.get('/types', function (req, res) {
  let response = {status: 'OK', list: []};
  console.log("Request all types");
  database.pokemons.forEach(function(pokemon){
    pokemon.types.forEach(function(type){
      let alreadyInList = 0;
      
      for(let i = 0; i < response.list.length; i++){
        if(response.list[i].nom == type.nom){
          alreadyInList = 1;
        }
      }

      if(alreadyInList == 0){
        response.list.push(type);
      }
    });
  });
  res.send(response);
});

app.get('/pokemons', function (req, res) {
  
  let response = {status:'KO', list: []};
  response.status = "OK";

  console.log("Request all pokemons");
      database.pokemons.forEach(function(pokemon){
        response.list.push(pokemon);
      });

  res.send(response);
  
});

app.get('/pokemonsParCat/:categorie', function (req, res) {
  
  let response = {status:'KO', list: []};
  
  if ('categorie' in req.params){
    response.status = "OK";
    let key = req.params.categorie;    
    key = key.toLowerCase();
    console.log("Recherche les pokemons de la categorie : " + key);
    database.pokemons.forEach(function(pokemon){
      pokemon.types.forEach(function(type){
        if(type.nom.toLowerCase() === key){
          response.list.push(pokemon);
        }
      });
    });

  }
  res.send(response);
  
});

app.get('/pokemonsParNom/:chaine', function (req, res) {
  
  let response = {status:'KO', list: []};
  
  if ('chaine' in req.params){
    response.status = "OK";
    let key = req.params.chaine;    
    key = key.toLowerCase();
    console.log("Recherche avec le mot : " + key);
    database.pokemons.forEach(function(pokemon){
      var name = pokemon.nom.toLowerCase();
      if(name.includes(key)){
        response.list.push(pokemon);
      }
    });

  }
  res.send(response);
  
});

app.get('/team', function (req, res) {
  
  let response = {status:'KO', team: []};
  response.status = "OK";
  var list = [];
  
  console.log("Request make team");
      database.pokemons.forEach(function(pokemon){
        list.push(pokemon);
      });

  for(let i = 0; i < 6; i++){
    var random = Math.floor(Math.random() * list.length);

    var isInTeam = 0;

    list[random].types.forEach(function(type){
      if(checkType(type, response.team) == false){
        isInTeam = 1;
      }
    });

    if(isInTeam === 1){
      i--;
    }else{
      response.team.push(list[random]);
    }
  }
  res.send(response);
});

function checkType(pokemonType, list){
  for(let i = 0; i < list.length; i++){
    list[i].types.forEach(function(type){
      if(pokemonType === type){
        return false;
      }
    });
  }
  return true;
}