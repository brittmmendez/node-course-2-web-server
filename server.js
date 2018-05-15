const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//create a port for heroku or default to 3000
const port = process.env.PORT || 3000;

let app = express();

//set up partials
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//for every request use this to display date and action in console and add it to server log
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`

  console.log(log)
  fs.appendFileSync('Server.log', log + '\n')
  next();
})

//hijacks all requests to only render this:
app.use((req, res, next) => {
  res.render('maintenance.hbs')
})

//need to be below maintenance or users will still be taken to this page
app.use(express.static(__dirname + '/public'));

//partial helper function
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

//partial helper function
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hello there and welcome. This is the message that will appear'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'This is an error'
  });
});

app.get('/me', (req, res) => {
  res.send({
    name: 'Britt',
    likes: [
      'walking',
      'icecream',
      'marco'
    ]
  })
});

app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
