require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies.json')
const CORS = require('cors')
const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
 app.use(morgan(morganSetting))
app.use(CORS());

app.use(function handleAuth(req, res, next) {

  const apiToken = process.env.API_TOKEN;
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



app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000 

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})