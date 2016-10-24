# Tune.ly Sprint 2

## Overview

This sprint we will:
* focus on **Create**
* build a form to save albums into our database
* add a route to our server so that it can receive the form's data and create the album

> Note: if you get stuck going through this, make use of the hints, your neighbors, and the solutions for sprint 2.

> You must complete all of the previous sprint before starting this sprint (excluding stretch challenges).

## Step 1: New Album Form

1. Open `views/index.html` in your text editor.

1. Edit the file by adding a new container and row after the jumbotron.

1. Use bootstrap to create a form to input album info.  Follow the fields we've already used in our database.

> Hint: You can build your own form or use some [pre-made html](/docs/code_samples/sprint2_form.html).


## Step 2: Getting Form Data

1. Edit your `app.js`. When the form is submitted, use jQuery to capture the form values and serialize them.  Start with a  `console.log` of the output. Its format should be similar to this sample serialized form data:

  ```js
  name=Marble+House&artistName=The+Knife&releaseDate=2006&genres=electronica%2C+synth+pop%2C+trip+hop
  ```

1. Reset the form input values after the data from the form has been captured or used.

## Step 3: A Route for Creating Albums

Next, let's add the correct RESTful route on the server.  We already know that POST is used to create a new resource.  If we're following good conventions, we'll use the same path that we did to retrieve all the albums.

```
POST  /api/albums
```

1. In `server.js`, add a new route after the current `GET` `/api/albums` route.  Make a new `create` function in your albums controller to handle this route.  Write a few comments to remind yourself what this route should do.  Start by `console.log`ing a message in this route.  For a response, start by sending back the data the server received.

  > Don't forget to export the `create` function from the controller, or it won't be accessible in `server.js`.

1. If you haven't yet, add the `body-parser` middleware to the server. Remember save `body-parser` into your project's dependencies when you install it.

1. You can test your new route by using AJAX (from your browser's JavaScript console), curl, or Postman.

curl (from Terminal):
```bash
 curl -X POST http://localhost:3000/api/albums --data "name=Marble+House&artistName=The+Knife&releaseDate=2006&genres=electronica%2C+synth+pop%2C+trip+hop"
```

> Hint: If using postman to POST, set the BODY type to x-www-form-urlencoded, then add key-value pairs.




## Step 4: AJAX Request

1. In the client-side JavaScript, set up your form handler to make a request to the proper route with the form data. Use AJAX.

1. Verify the proper message is getting logged by the server when you submit the form.

1. On the server side, break the data we're getting from the `genre` field into an array.

> Hint: the `split` method may be handy here.

## Step 5: Fill in controller implementation for `create`.

1. Connect the new route's controller to the database.  Make sure you're returning the newly created album.

1. Test it!

> Hint: if you get stuck here, take a look at the solution branch for sprint 2.

## Step 6: Display new album.

1. When your server returns JSON, display it on the page.  We already have a function to render it!

1. TEST ALL THE THINGS!

  ![Test all the things](http://www.daedtech.com/wp-content/uploads/2012/12/TestAllTheThings-300x225.jpg)

## Stretch Challenges

1. Add HTML5 form validations to the form.  For example, require that a user fill in all the fields before your app processes the form. (What do you think should happen if the user submits the form with empty fields?)

1. Convert the form to a modal, and add a link to the right-side of the "Albums" header to open it!
