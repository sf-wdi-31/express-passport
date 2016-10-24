<!--
Creator: DC Team
Last Edited by: Brianna
Location: SF
-->

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# Local Authentication with Express and Passport

### Why is this important?
<!-- framing the "why" in big-picture/real world examples -->
*This workshop is important because:*

Controlling access to data is a key part of many modern web applications. Rails does a lot of the work of authentication and authorization for us behind the scenes.  Today we'll see that Rails's "local" (in-app) authentication strategy generalizes to other languages and frameworks. We'll use a library called Passport, for Node.js, and we'll specifically dive into its `passport-local` implementation.  


### What are the objectives?
<!-- specific/measurable goal for students to achieve -->
*After this workshop, developers will be able to:*

* Explain key steps of a framework-independent local authentication strategy.
* Authenticate users with a "local" strategy with the Passport library.
* Restrict access to data based on whether a user is authenticated.
* Describe alternate authentication or authorization strategies.

### Where should we be now?
<!-- call out the skills that are prerequisites -->
*Before this workshop, developers should already be able to:*

* Implement client-side forms and AJAX calls.
* Create an express application with RESTful routes.
* Set up schemas and models with Mongoose.
* CRUD data in a MongoDB database through Mongoose.  
* Describe the authentication strategy used with `has_secure_password` from Ruby on Rails.


## Passport - Intro (5 mins)

From the [passport website](http://passportjs.org/docs):

"_Passport is authentication middleware for Node. It is designed to serve a singular purpose: authenticate requests. When writing modules, encapsulation is a virtue, so Passport delegates all other functionality to the application. This separation of concerns keeps code clean and maintainable, and makes Passport extremely easy to integrate into an application.

In modern web applications, authentication can take a variety of forms. Traditionally, users log in by providing a username and password. With the rise of social networking, single sign-on using an OAuth provider such as Facebook or Twitter has become a popular authentication method. Services that expose an API often require token-based credentials to protect access.

Passport recognizes that each application has unique authentication requirements. Authentication mechanisms, known as strategies, are packaged as individual modules. Applications can choose which strategies to employ, without creating unnecessary dependencies._"

#### Check for Understanding

1. What language and/or framework(s) is Passport meant for?  
1. What are Passport's main selling points?  
1. What are some ways that websites manage authentication?   


### Local Authentication

What was the strategy we used to authenticate users with Ruby on Rails?

1. Working in teams of 3-4, outline what a Rails does to authenticate a user. You should include the entire process of enabling logging in and logging out. Expect that to include forms, requests from the client to various routes on the server, database or session interactions, and the server's responses.  

  <details><summary>click for an example of how you might start signup</summary>
  - Show signup form with username, password fields (could be part of another page or served at a separate /signup route).
  - Send signup form details to server with POST /users.
     - If username exists, redirect back to form with an error message.
     - If username doesn't exist, create user in database.
  ..._and so on_
  </details>


1. Which parts of your outline could be reused in any language or framework?

The tactic of checking a username and password combination within your own app is called "local" authentication. It can be more or less secure depending on how you store and send the usernames and passwords.  

### Strategies in Passport

The main concept when using passport is to register **strategies**.  

In Passport, a strategy is just some Node.js middleware that we configure to manage authentication.  

With `passport-local`'s `LocalStrategy`, the middleware takes in the user's login information (usually a username and password) as well as a callback. The strategy interacts with the database to check whether the user exists and whether they've used the correct password.  After the check, the callback is called with three arguments:  any server error that occurred (or `null`), any user who was successfully authenticated (or `false`), and an optional error message to specify what went wrong.

Once we have a strategy set up, we can use `passport.authenticate` inside a route or controller to say which authentication strategy to use and what should happen next in cases where authentication succeeds or fails.

Authenticating with passport also gives us handy helper methods like `req.login` and `req.logout` and sets the value of a `req.user` variable!

There are a few configuration steps, and of course we have to set up front-end forms to gather users' login information. Overall, though, Passport allows rather simple, modular authentication for various strategies.


### Implementing `passport-local`

Passport has some great [documentation](http://passportjs.org/docs/username-password) on how to set up a simple local authentication strategy with username and password.


Before we can implement that, though, we need to have users set up in our app.

#### Setup: Routes and View Changes

1. Add API routes to create users and get the data for a single user. Also add routes to log in and log out.

1. On the main page of your site, add a form for signing up a new user. It should post to the user create route.  

1. On the main page of your site, add a form for logging in.

1. On the main page of your site, add a link to log out.

<!-- 1. On the main page of your site, add a link to "Profile." We'll set it up to show the current user's information. -->

#### Setup: Creating Users

Let's start with signing up. We'll need:

* the sign up form
* the route that receives the params sent by the form   
* a controller/handler to handle and respond to requests on that route

1. We already have a form and a route, so create a handler that responds with a simple "sanity check" response. You can also set up `debugger` or `console.log` to check that the parameters.  Submit the sign up form, and check that you see the server output you expect.  

1. Create a schema and model for user data.  In your schema, we suggest using `email` and `passwordDigest`.

  ```js
  var userSchema = new Schema({
    email: String,
    passwordDigest: String
  });
  ```


#### Setup: Password Encryption

At this point, we could save user data into the database, but we'd be saving passwords without any sort of encryption.

1. The same encryption algorithm we used with Rails is available as a Node module! Install `bcrypt` in your project, then require it into your user model file.

   ```js
   var bcrypt = require('bcrypt');
   ```

1. Set up a salt to use with your passwords.  This adds on some random-looking data to make rainbow table attacks harder.

  ```js
  var salt = bcrypt.genSaltSync(10);
  ```

1. Create an `encrypt` method that takes in a user's actual password, uses bcrypt to salt and hash it, and returns the encrypted version.

  ```js
  userSchema.statics.encrypt = function(password) {
    return bcrypt.hashSync(password, salt);
  };
  ```

  > This function is inside the schema's `statics` object so that it will be accessible as a "static" method of our model. That is, we'll call it with `User.encrypt('mypassword')`.  See [mongoose's static method documentation](http://mongoosejs.com/docs/guide.html#statics).

1. Now that we're set up to encrypt passwords, we also need a way to check if the password a user sends us matches the encrypted version we'll store. Create a `validPassword` method that does this check.

  ```js
  User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
  ```

  > This function is inside the schema's `methods` object so that it will be accessible as an "instance" method. That is, we'll call it with `someUser.validPassword('mypassword')`.  See [mongoose's instance method documentation](http://mongoosejs.com/docs/guide.html#methods).

#### Passport! Server File Updates

In the server file, we'll want a few more items required:

```js
var passport     = require('passport');
var flash        = require('connect-flash');  // for flash messages
var cookieParser = require('cookie-parser');  // cookies!
var bodyParser   = require('body-parser');
var session      = require('express-session');  // sessions!

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'I am not so secret.' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
```

If you're missing any of the node packages above, be sure to install them!

#### Passport! Strategy

1. Our Passport strategy will handle most of our server's sign up logic. Create a `config` directory and a `config/passport.js` file in your project.

1. To connect this file to our server, we'll add a few lines.  

  * First, at the very bottom of `config/passport.js`:

  ```js
  // below everything else in config/passport.js
  module.exports = function(passport) {
    passport.use('local', localStrat);  // we'll set up localStrat soon!
  };
  ```

  * Also, on the server side,

  ```js
    require('./config/passport')(passport);
  ```

1. Inside `config/passport.js`, require `passport-local` and your user model.

  ```javascript
  var passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

  var User = require('../models/user');
  ```

1. Configure a local strategy for this app.

  ```js

  localStrat = new LocalStrategy({
    usernameField : 'email',        // we're using email instead of username
    passwordField : 'password',     // will be password from client side
    passReqToCallback : true        // allow access to request in verify callback
  }, function(req, email, password, done) {  // this is the verify callback
    // ... more to come here!
  });
  ```

  > The first argument given to the `LocalStrategy` constructor is an object. It contains some configuration options about the parameters we'll use for authentication. Note that we've chosen to use `email` instead of Passport's default `username` and that we'll be passing the request object into the verify callback.

  > The second argument is a "verify callback" function that says how we'll go about authenticating a user based on those parameters.



  Now, inside this callback method, we will implement our custom logic to signup a user.

  ```javascript
    ...
    }, function(req, email, password, callback) {
      // Find a user with this e-mail
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) return callback(err);

        // If there already is a user with this email
        if (user) {
  	return callback(null, false, req.flash('signupMessage', 'This email is already used.'));
        } else {
        // There is no email registered with this emai
  	// Create a new user
  	var newUser            = new User();
  	newUser.local.email    = email;
  	newUser.local.password = newUser.encrypt(password);

  	newUser.save(function(err) {
  	  if (err) throw err;
  	  return callback(null, newUser);
  	});
        }
      });
    }));
    ....

  ```




First we will try to find a user with the same email, to make sure this email is not already use.

Once we have the result of this mongo request, we will check if a user document is returned - meaning that a user with this email already exists.  In this case, we will call the `callback` method with the two arguments `null` and `false` - the first argument is for when a server error happens; the second one corresponds to the user object, which in this case hasn't been created, so we return false.

If no user is returned, it means that the email received in the request can be used to create a new user object. We will, therefore create a new user object, hash the password and save the new created object to our mongo collection. When all this logic is created, we will call the `callback` method with the two arguments: `null` and the new user object created.

In the first situation we pass `false` as the second argument, in the second case, we pass a user object to the callback, corresponding to true, based on this argument, passport will know if the strategy has been successfully executed and if the request should redirect to the `success` or `failure` path. (see below).

Note: Using flash messages requires a req.flash() function. Express 2.x provided this functionality, however it was removed from Express 3.x. Use of connect-flash middleware is recommended to provide this functionality when using Express 3.x.

#### User.js

The last thing is to add the method `encrypt` to the user model to hash the password received and save it as encrypted:

```javascript
  User.methods.encrypt = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
```

As we did in the previous lesson, we generate a salt token and then hash the password using this new salt.

That's all for the signup strategy.

#### Route Handler

Now we need to use this strategy in the route handler.

In the `users.js` controller, for the method `postSignup`, we will add the call to the strategy we've declared

```javascript
  function postSignup(request, response) {
    var signupStrategy = passport.authenticate('local-signup', {
      successRedirect : '/',
      failureRedirect : '/signup',
      failureFlash : true
    });

    return signupStrategy(request, response);
  }
```

Here we are calling the method `authenticate` (given to us by passport) and then telling passport which strategy (`'local-signup'`) to use.

The second argument tells passport what to do in case of a success or failure.

- If the authentication was successful, then the response will redirect to `/`
- In case of failure, the response will redirect back to the form `/signup`


#### Session

We've seen in previous lessons that authentication is based on a value stored in a cookie, and then, this cookie is sent to the server for every request until the session expires or is destroyed. This is a form of [serialization](https://en.wikipedia.org/wiki/Serialization).

To use the session with passport, we need to create two new methods in `config/passport.js` :

```javascript
  module.exports = function(passport) {

    passport.serializeUser(function(user, callback) {
      callback(null, user.id);
    });

    passport.deserializeUser(function(id, callback) {
      User.findById(id, function(err, user) {
          callback(err, user);
      });
    });
  ...

```

What exactly are we doing here? To keep a user logged in, we will need to serialize their user.id to save it to their session. Then, whenever we want to check whether a user is logged in, we will need to deserialize that information from their session, and check to see whether the deserialized information matches a user in our database.

The method `serializeUser` will be used when a user signs in or signs up, passport will call this method, our code then call the `done` callback, the second argument is what we want to be serialized.

The second method will then be called every time there is a value for passport in the session cookie. In this method, we will receive the value stored in the cookie, in our case the `user.id`, then search for a user using this ID and then call the callback. The user object will then be stored in the request object passed to all controller methods calls.

## Flash Messages - Intro (5 mins)

Remember Rails? Flash messages were one-time messages that were rendered in the views and when the page was reloaded, the flash was destroyed.  

In our current Node app, back when we have created the signup strategy, in the callback we had this code:

```javascript
  req.flash('signupMessage', 'This email is already used.')
```

This will store the message 'This email is already used.' into the response object and then we will be able to use it in the views. This is really useful to send back details about the process happening on the server to the client.


## Incorporating Flash Messages - Codealong (5 mins)

In the view `signup.hbs`, before the form, add:

```hbs
  {{#if message}}
    <div class="alert alert-danger">{{message}}</div>
  {{/if}}
```

Let's add some code into `getSignup` in the users Controller to render the template:

```javascript
  function getSignup(request, response) {
    response.render('signup.hbs', { message: request.flash('signupMessage') });
  }
```

Now, start up the app using `nodemon app.js` and visit `http://localhost:3000/signup` and try to signup two times with the same email, you should see the message "This email is already used." appearing when the form is reloaded.


## Test it out - Independent Practice (5 mins)

All the logic for the signup is now set - you should be able to go to `/signup` and create a user.


## Sign-in - Codealong (10 mins)

Now we need to write the `signin` logic.

We also need to implement a custom strategy for the login, In passport.js, after the signup strategy, add add a new LocalStrategy:

```javascript
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, callback) {

  }));
```

The first argument is the same as for the signup strategy - we ask passport to recognize the fields `email` and `password` and to pass the request to the callback function.

For this strategy, we will search for a user document using the email received in the request, then if a user is found, we will try to compare the hashed password stored in the database to the one received in the request params. If they are equal, the the user is authenticated; if not, then the password is wrong.

Inside `config/passport.js` let's add this code:

```javascript
  ...
  }, function(req, email, password, callback) {

    // Search for a user with this email
    User.findOne({ 'local.email' :  email }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // If no user is found
      if (!user) {
        return callback(null, false, req.flash('loginMessage', 'No user found.'));
      }
      // Wrong password
      if (!user.validPassword(password)) {
        return callback(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }

      return callback(null, user);
    });
  }));
  ...

```

#### User validate method

We need to add a new method to the user schema in `user.js` so that we can use the method `user.validatePassword()`. Let's add:

```javascript
  User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
```

#### Adding flash messages to the view

As we are again using flash messages, we will need to add some code to display them in the view:

In `login.hbs`, add the same code that we added in `signup.hbs` to display the flash messages:

```javascript
  {{#if message}}
    <div class="alert alert-danger">{{message}}</div>
  {{/if}}
```

#### Login GET Route handler

Now, let's add the code to render the login form in the `getLogin` action in the controller (`users.js`):

```javascript
  function getLogin(request, response) {
    response.render('login.hbs', { message: request.flash('loginMessage') });
  }
```

You'll notice that the flash message has a different name (`loginMessage`) than the in the signup route handler.

#### Login POST Route handler

We also need to have a route handler that deals with the login form after we have submit it. So in `users.js` lets also add:

```javascript
  function postLogin(request, response) {
    var loginProperty = passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/login',
      failureFlash : true
    });

    return loginProperty(request, response);
  }
```

You should be able to login now!

## Test it out - Independent Practice (5 mins)

#### Invalid Login

First try to login with:

- a valid email
- an invalid password

You should also see the message 'Oops! Wrong password.'

#### Valid Login

Now, try to login with valid details and you should be taken to the index page with a message of "Welcome".

The login strategy has now been setup!


#### Accessing the User object globally

By default, passport will make the user available on the object `request`. In most cases, we want to be able to use the user object everywhere, for that, we're going to add a middleware in `app.js`:

```javascript
  require('./config/passport')(passport);

  app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });
```

Now in the layout, we can add:

```javascript
<ul>
  {{#if currentUser}}
    <li><a href="/logout">Logout {{currentUser.local.email}}</a></li>
  {{else}}
    <li><a href="/login">Login</a></li>
    <li><a href="/signup">Signup</a></li>
  {{/if}}                
</ul>
```

## Signout - Codealong (10 mins)

#### Logout

The last action to implement for our authentication system is to set the logout route and functionality.

In `controllers/users.js`:
```js
function getLogout(request, response) {
  request.logout();
  response.redirect('/');
}
```

## Test it out - Independent Practice (5 mins)

You should now be able to login and logout! Test this out.

## Restricting access (10 mins)

As you know, an authentication system is used to allow/deny access to some resources to authenticated users.

Let's now turn our attention to the `secret` route handler and it's associated template.

To restrict access to this route, we're going to add a method at the top of `config/routes.js`:

```javascript
  function authenticatedUser(req, res, next) {
    // If the user is authenticated, then we continue the execution
    if (req.isAuthenticated()) return next();

    // Otherwise the request is always redirected to the home page
    res.redirect('/');
  }
```

Now when we want to "secure" access to a particular route, we will add a call to the method in the route definition.

For the `/secret` route, we need to add this to the `/config/routes.js` file:

```javascript
  router.route("/secret")
    .get(authenticatedUser, usersController.secret)
```

Now every time the route `/secret` is called, the method `authenticatedUser` will be executed first. In this method, we either redirect to the homepage or go to the next method to execute.

Now test it out by clicking on the secret page link. You should see: "This page can only be accessed by authenticated users"


## Independent Practice (20 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

- Add pages with restricted access.

- Once the user is authenticated, make sure he/she can't access the sign-in or sign-up and redirect with a message, and vice-versa for the logout

## Conclusion (5 mins)

Passport is a really useful tool because it allows developers to abstract the logic of authentication and customize it, if needed. It comes with a lot of extensions that we will cover later.

- How do salts work with hashing?
- Briefly describe the authentication process using passport in Express.
