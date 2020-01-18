console.log('hello')

const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')
const CORS = require('cors')
const app = express()

app.use(morgan('dev'))
app.use(CORS());
/* app.use((req, res) => {
  res.send('Hello, world!')
}) */
console.log(process.env.API_TOKEN)

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]


app.use(function validateBearerToken(req, res, next) {
       console.log('validate bearer token middleware')
       const apiToken = process.env.API_TOKEN;
       const authToken = req.get('Authorization') 
       console.log(apiToken)
       console.log(authToken.split(' ')[1])
       if (!authToken || authToken.split(' ')[1] !== apiToken) {
            return res.status(401).json({ error: 'Unauthorized request' })
          } 
       // move to the next middleware
       next();
     })



function handleGetTypes(req, res) {
    res.send(validTypes)
     }
    
     app.get('/types', handleGetTypes)

     function handleGetPokemon(req, res) {
         const {name , type} = req.query;
         let results = POKEDEX.pokemon
        console.log('name is : ' + name)

         if (name){
          results = POKEDEX.pokemon.filter(pok => 
                pok.name.toLowerCase().includes(name.toLowerCase()));
           
            return res.send(results)
         }
         if(type) {
             results = results.filter(pok => 
                pok.type.includes(type)
                );
         }
         //respond with json
         if(name || type) {
             return res.json(results)
         } else {
            res.send('Hello, Pokemon!')
         }
           

         }
        
     app.get('/pokemon', handleGetPokemon)


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})