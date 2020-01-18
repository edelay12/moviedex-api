const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies.json')
const CORS = require('cors')
const app = express()

app.use(morgan('dev'))
app.use(CORS());

app.use(function handleAuth(req, res, next) {

    const apiToken = '98fed4d8-2015-45b5-9ebc-26f47ea7922d';
    const authToken = req.get('Authorization') 

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
      } 
    next();
    })


function handleMovies(req, res) {
const {genre , country , vote} = req.query;
let results = MOVIES;
if (genre) {
    results = results.filter(movie => 
        movie.genre.toLowerCase().includes(genre.toLowerCase()))
}
if(country) {
    results = results.filter(movie => 
        movie.country.toLowerCase().includes(country.toLowerCase())
        );
}
if(vote) {
  results = results.filter(movie => 
     movie.avg_vote >= vote
    );
}
res.send(results)
}
app.get('/movies' , handleMovies);


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})