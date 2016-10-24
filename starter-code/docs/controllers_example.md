## Server-side Example: separating route logic into controllers


#### Before Controllers

If you haven't seen this before, you may be surprised to discover that the logic for every route doesn't have to be in `server.js`.  If you think about it, though, it's obvious that in large apps, server.js would become very long and hard to work with. _yuck_

#### Controllers and Resources

We're going to use the module pattern to separate out some of the code that's currently in our server.js.  Have you heard the term **resource**?  A **resource** is just a type of data your app stores -- and it can be thought of as being related to the endpoints in your routes.  For example, in Tunely we'll have a `/api/albums/:id` route.  `albums` is a resource here. To take full advantage of the module pattern, we'll create a module for each resource where we'll store all the server's logic for interacting with that resource. This logic module will be called the **controller** for that resource. So each resource in your database will have its own **model** and its own **controller**. You might later add `artists` or `record_labels` and give each one its own **controller** and **model**.    

#### Modules

You've already seen this pattern when using models!

1. We `export` the relevant objects from a file.  
1. We `require` those other files in an `index.js` to group them and then re-`export` everything inside one object.
1. When we need to use those objects, we `require` the directory containing those files (this reads `index.js` and retrieves that combined controller object).

The key here is to realize that `module.exports` always starts as an empty object `{}`.  

> If you `module.exports = { key: value }`, you can export anything!

Let's look at an example:

```
├── server.js
└── models
    ├── index.js
    ├── quote.js
    └── author.js

```
 
```js
// models/quote.js
// ... some stuff
var Quote = mongoose.model('Quote', QuoteSchema);
module.exports = Quote;
```

```js
// models/author.js
// ... some stuff
var Author = mongoose.model('Author', AuthorSchema);
module.exports = Author;
```

```js
// models/index.js
module.exports.Author = require('./author');
module.exports.Quote = require('./quote');
```

In the above `index.js` is exporting an object that looks like:

```js
{ 
  Author: AuthorModel,
  Quote: QuoteModel
}
```

Anywhere we import `models/index`, or even `models`, we get that object.

Let's take a look:

```js
server.js

var db = require('./models');

// later on you can
db.Author.save
db.Author.find
// etc
```

#### Applying this to controllers

Let's refactor `server.js` to use controllers. Here's our starting point:

```js
// server.js


app.get('/api/cards', function cardsIndex(req, res) { 
  // get all cards from the database 
  db.Card.find({}, function(err, allCards) {
    // add some error checking here!
    // respond, sending all cards back
    res.json(allCards);
  });
}
app.post('/api/cards', function cardsCreate(req, res) { 
  // make a new card with the form data from req.body
  var newCard = new Card({
    frontText: req.body.frontText,
    backText: req.body.backText
  });
}
app.get('/api/cards/:id', function cardsShow(req, res) { 
  // pull card id out of the request
  var cardId = req.params.card_id;
  // get single card from the database 
  db.Card.findOne({_id: cardId}, function(err, thatCard) {
    // add some error checking here!
    // respond, sending all cards back
    res.json(thatCard);
  });
}
```

> aww, check out those beautiful RESTful routes!

##### New file structure



```
├── server.js
└── controllers
    ├── index.js
    └── cards.js
└── models
    ├── index.js
    ├── authors.js
    └── cards.js
```

##### Refactor

```js
// controllers/cards.js

// send all card data back!
function index(req, res) {
  // get all cards from the database 
  db.Card.find({}, function(err, allCards) {
    // add some error checking here!
    // respond, sending all cards back
    res.json(allCards);
  });
}

// create a card!
function create(req, res) {
  // make a new card with the form data from req.body
  var newCard = new Card({
    frontText: req.body.frontText,
    backText: req.body.backText
  });
}

// send data for one card
function show(req, res) {
  // pull card id out of the request
  var cardId = req.params.card_id;
  // get single card from the database 
  db.Card.findOne({_id: cardId}, function(err, thatCard) {
    // add some error checking here!
    // respond, sending all cards back
    res.json(thatCard);
  });
}

var publicMethods = {
  index: index,
  create: create,
  show: show
}
module.exports = publicMethods;
```

Then, in `controllers/index.js`, we require and re-export.  

> This step may seem odd right now, but when you have 15 controllers, you'll thank us.

```js
// controllers/index.js
module.exports.cards = require('./cards');
module.exports.someOtherController = require('./someOtherController');
```

Finally in `server.js` we connect these together:

```js
// server.js
var controllers = require('./controllers');

app.get('/api/cards', controllers.cards.index);
app.post('/api/cards', controllers.cards.create);
app.get('/api/cards/:id', controllers.cards.show);
```

![dancing semaphore man](https://media.giphy.com/media/rDroB384ydCvK/giphy.gif)

#### Wrap-up

Using this pattern, it becomes clear where to find the logic for each route, and your `server.js` file becomes much cleaner.  It also helps us start using some conventional names for RESTful routes: index, show, create, etc.  We also group the logic by **resource**, which makes it easier for future developers on the project to find what they need.

Your `server.js` file is effectively now a list of routes with the controller methods those routes use.  When you work with other server architectures, you will run into very similar patterns. Knowing how this works will help you to adapt to other technologies you come across!

