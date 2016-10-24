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

At this point, we could save user data into the database, but we haven't set it up to save a `passwordDigest` since we're just sending a `password` field.  That's okay - we'd be saving passwords without any sort of encryption.

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
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
  ```

  > This function is inside the schema's `methods` object so that it will be accessible as an "instance" method. That is, we'll call it with `someUser.validPassword('mypassword')`.  See [mongoose's instance method documentation](http://mongoosejs.com/docs/guide.html#methods).

We'll use these methods soon.

#### Passport! Server File Updates

In the server file, we'll want a few more dependencies required and configured:

```js
var expressSession = require('express-session');
sessionOptions = {
  secret: 'I am not so secret.',
  resave: false,
  saveUninitialized: false
}
app.use(expressSession(sessionOptions));

// passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

```

If you're missing any of the node packages above, be sure to install them!

#### Passport! Strategy

1. Our Passport strategy will handle most of our server's sign up logic. Create a `config` directory and a `config/passport.js` file in your project.

1. To connect this file to our server, we'll add a few lines.  

  * First, at the very bottom of `config/passport.js`:

  ```js
  // below everything else in config/passport.js
  module.exports = function(passport) {
    passport.use('local-signup', localStrat);  // we'll set up localStrat soon!
  };
  ```

  * Also, on the server side,

  ```js
    require('./config/passport')(passport);
  ```

  > This line should come *after* the `passport` variable is defined.

1. Inside `config/passport.js`, require `passport-local` and your database models.

  ```javascript
  var passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

  var db = require('../models');
  ```

1. Configure a local strategy for this app.

  ```js

  localStrat = new LocalStrategy({
    usernameField : 'email',        // we're using email instead of username
    passwordField : 'password',     // will be password from client side
    passReqToCallback : true        // allow access to request in verify callback
  }, verifyCalback);

  function verifyCallback(req, email, password, done) {  // this is the verify callback
    // ... more to come here!
  }
  ```

  > The first argument given to the `LocalStrategy` constructor is an object. It contains some configuration options about the parameters we'll use for authentication. Note that we've chosen to use `email` instead of Passport's default `username` and that we'll be passing the request object into the verify callback.

  > The second argument is a "verify callback" function that says how we'll go about authenticating a user based on those parameters.



1. Now, we'll move our logic for signing up a user out of the users controller and into the verify callback.

  ```js
  function verifyCallback(req, email, password, done) {
    // find a user with this email
    db.User.findOne({ 'email' :  email }, function(err, user) {
      if(err) {   // some error in the server or db
        return done(err);
      } else if(user){  // there already is a user with this email
        return done(null, false);
      } else { // no errors and email isn't taken - create user!
        var newUser = new db.User();
        newUser.email = email;
        newUser.passwordDigest = User.encrypt(password);
        newUser.save(function(err){
          if(err){
            return done(err);
          }
          return done(null, newUser);
        });
      }
    });
  }

  ```



<details><summary>Click for detailed explanation of the verify callback above. </summary>
First we try to find a user with the same email, to make sure this email is not already use.

The result of this may include an error and a user.  If an error is returned, we call the `done` callback on that error.

If a user document is returned, a user with this email already exists.  In this case, we will call the `done` callback  with the two arguments `null` and `false` - the first argument is for when a server error happens; the second one corresponds to the user object, which in this case hasn't been created, so we return false.

If no user is returned, it means that the request body can be used to create a new user object. We will, therefore create a new user object, hash the password and save the new created object to our mongo collection. When that is finished successfully, we will call the `done` method on `null` and the new user object created.
</details>

Based on how we call the `done` function, Passport will know if the strategy has been successfully executed and whether it resulted in an authenticated user or not.

#### Route Handler

The users controller doesn't need to manage all of this logic any more. Switch the controller over to rely on the Passport strategy we've set up.


1. In the users controller, empty out the method `create`.

  ```js
  function create(req, res){
    console.log('creating user', req.body);
    res.send('signing up sanity check');
  }
  ```


1. Add a call to the strategy we've set up:

  ```js
  function create(req, res){
    console.log('creating user', req.body);
    var signupAttempt = passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/'
    });
    return signupAttempt(req, res);
  }
  ```

 > See [custom callback](http://passportjs.org/docs/#custom-callback).

<details><summary>click for explanation of code above</summary>
Here we are calling the method `authenticate` (given to us by passport) and then telling passport which strategy (`'local-signup'`) to use.

The second argument tells passport what to do in case of a success or failure.

- If the authentication was successful, then the response will redirect to `/`
- In case of failure, the response will redirect back to `/`.
</details>

#### Passport! Session

Sessions store some value in a cookie, and this cookie is sent to the server for every request until the session expires or is destroyed. In order to store and transfer the data in the cookie, there has to be some sort of  [serialization](https://en.wikipedia.org/wiki/Serialization).

1. To use sessions with Passport, we need to configure our cookies by  creating two new methods in `config/passport.js` :

  ```js
  module.exports = function(passport) {
    passport.use('local-signup', localStrat);

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      db.User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  };
  ```

<details><summary>What exactly are we doing here?</summary>
To keep a user logged in, we will need to serialize some information about them and save it in their session.  We've chosen to save the user's `id`. Then, whenever we want to check whether a user is logged in, we will need to deserialize that information from their session and check to see whether the deserialized information matches a user in our database.

Passport will call  `serializeUser` when a user logs in or signs up. In the `done` callback, the second argument is what we want to be serialized for the cookie.  This lets us go from a complex user to an id small enough to fit into a cookie.

The `deserializeUser` function will be called every time there is a value for Passport in the session cookie.

This lets us go from an id to a user. As this function runs, we will receive the value stored in the cookie (the `user.id`), search for a user by id, and then call a `done` callback with the user we found.

Passport stores the user object in `req.user` and passes it to all controller method calls.
</details>


### Test It Out

All the logic for the signing up is now set - you should be able to fill out the form and create a user.

### Logging out

Follow the instructions in Passport's [documentation on logging out](http://passportjs.org/docs/logout) to enable logging out in your app.

### Logging In

Now we can write the logic for logging in.

#### Form, Route & Request

1. Create a login form if you haven't.

1. Make sure you have a login route.  One possibility is:

  ```js
  app.post('/login', controllers.users.login);
  ```

1. Set up your login form to make a request to your login route.

#### Strategy

We'll implement another custom strategy for login.

1. In `config/passport.js`, after the signup strategy, add add a new LocalStrategy:

  ```javascript
  loginLocalStrat = new LocalStrategy({
      usernameField : 'email',        // we're using email instead of username
      passwordField : 'password',     // will be password from client side
      passReqToCallback : true        // allow access to request in verify callback
    }, loginVerifyCallback);

  ```

  > The first argument is the same as for the signup strategy - we ask passport to recognize the fields `email` and `password` and to pass the request to the callback function.

1. Write the `loginVerifyCallback`.

  <details><summary>click for explanation</summary>
  For this strategy, we will search for a user document using the email received in the request. If a user is found, we will compare the hashed password stored in the database to the one received in the request params. If the passwords are a match, the user is authenticated. If they aren't a match, then the password is wrong and the user isn't authenticated.
  </details>

  <details><summary>click for code</summary>

  ```js
  function loginVerifyCallback(req, email, password, done) {
    // Search for a user with this email
    db.User.findOne({ 'email' :  email }, function(err, user) {
      if (err) { // database error
        return done(err, false);
      } else if (!user) { // no user found
        console.log('email not found');
        return done(null, false);
      } else if (!user.validPassword(password)) {  // wrong password
        console.log('invalid password');
        return done(null, false);
      }
      console.log('authenticated', user);
      return done(null, user);
    });
  };
  ```
  </details>

1. Remember to add the strategy to `module.exports` from `config/passport.js`.

#### Login POST Route handler

We need a route handler that deals with the login form's data after it's submitted.

This example assumes we've chosen to make this route:

```js
app.post('/login', controllers.users.login);
```

1. In the users controller, build out a login method:


```javascript
  function postLogin(request, response) {
    var loginProperty = passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/login'
    });

    return loginProperty(request, response);
  }
```


### Test It Out


You should be able to login now!

1. Try to login with:

  - a valid email
  - a valid password

1. Try to log in with:

  - a valid email
  - an invalid password

1. Try to log in with:

  - an invalid email
  - an invalid password


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

### Resources
- [`express-session`](https://github.com/expressjs/session)

## Conclusion (5 mins)

Passport is a really useful tool because it allows developers to abstract the logic of authentication and customize it, if needed. It comes with a lot of extensions that we will cover later.

- How do salts work with hashing?
- Briefly describe the authentication process using passport in Express.
