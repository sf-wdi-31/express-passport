# Tune.ly Sprint 1

## Overview

This sprint we will:
* focus on **Read**
* connect our _partially_ pre-built front-end to a back-end with hard-coded data.
* replace the hard-coded data with data stored in a MongoDB database


## Step 0:

Now would be a great time to explore the files provided for you.  In particular, note:
* the html in `views/index.html`
* the incomplete server in `server.js`
* the included `package.json`

### Workflow Tips

- Use `nodemon` or `node server.js` to run your server.  

- Continually verify that your browser console is displaying the `app.js loaded!` message on document-ready.

- Check for error messages in both the terminal where your server is running and in the browser console.

- Start your work on a new branch (`git checkout -b my_sprint1`).  Add and commit your change frequently -- **at least once per step**!


## Step 1: Display hard-coded data.

Let's start on the outside and work our way in.  

1. Open `index.html` in your text editor and find the HTML for an **album**.  This is a hard-coded sample set up for you to show the desired HTML structure.  Convert this into a handlebars template using the data structure shown in the array of albums from `app.js`. Leave the`div` with class `albums` in place.

  <details><summary>hint</summary>You'll need to wrap the album template inside a `<script>` tag.  Then replace the sample data with appropriate attribute placeholders.  (You can find the correct attributes in the array of objects provided in `app.js`.) Remember the handlebars syntax for a variable whose value will be inserted later: `{{variableName}}`. </details>

1. Open `app.js` and edit the function `renderAlbum` to display one album on the page.  Use the handlebars template.

  <details><summary>hint</summary>You'll need to select the handlebars script you created, pull the source html from inside it, and compile it into a template function.  Use your template function to create an HTML string with the album's attributes filled in, and finally use jQuery to add it to the page.</details>

1. Run the `renderAlbum` function when the DOM is ready, and pass in `sampleAlbums[0]` (just one album) to test.  Verify that the page still looks like it did initially.

  <details><summary>hint: calling `renderAlbum`</summary>

  ```js
  $(document).ready(function() {
    console.log('app.js loaded!');
    renderAlbum(sampleAlbums[0]);
  });
  ```
  </details>


## Step 1.5: Rendering all the albums.

1. Update your code to use **all** the sample albums in the `sampleAlbums` array by rendering each one individually and adding it to the page.  Try to use `sampleAlbums.forEach` to call `renderAlbum` on each album.

  > Note that we could use Handlebar's templates `#each` method and pass it all the albums at once. However, we're planning to be able to add individual albums later on, so we'll need the ability to render each album individually.  Having two separate render functions and templates (1 for individual albums, 1 for all albums) seems excessive at this point.  


At this point you should see all the hard-coded albums from `app.js`'s `sampleAlbums` rendered on page, and the original hard-coded album should be gone.  

<details><summary>Click to see how to request and render all of the albums with handlebars</summary>

```js
$(document).ready(function() {
  console.log('app.js loaded!');
  $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: renderMultipleAlbums
  });
});

function renderMultipleAlbums(albums) {
  albums.forEach(function(album) {
    renderAlbum(album);
  });
}

// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album', album);
  var albumHtml = $('#album-template').html();
  var albumsTemplate = Handlebars.compile(albumHtml);
  var html = albumsTemplate(album);
  $('#albums').prepend(html);
}

```
</details>

## Step 2: Albums Index

We're going to add the following _index_ api route on our server:

```
GET /api/albums
```

To better organize this app, we're going to be using "controllers" to separate out logic for different _resources_ (different kinds of data we store).  That means that when you create a route like `/api/albums/:id`, you'll put the server code to handle that in a separate file, grouped with all the other handlers for routes dealing with the albums resource.  

We'll use the module pattern to make these "controller" functions available in the server.  See also: [big explanation about controllers and the module pattern!](controllers_example.md).  

1. In `server.js`, you'll see a line that `require`s the controllers directory. Take a look at  `controllers/index.js` and `controllers/albumsController.js`.

1. Back in `server.js`, create a new route for `GET`  `/api/albums`.  Based on the controller pattern we'll use, this route's callback should be `controllers.albums.index`.

1. In `controllers/albumsController.js`, fill in the `index` function so that it returns all albums from the hard-coded data in this file.

1. Update the `index` function to respond with JSON for all the albums.

1. In `app.js`, use AJAX to get the albums.  Render them on the page.

1. You should be able to safely delete the hard-coded data in `app.js` now!

> The data in `server.js` and `app.js` is different. This should make it easier to see which data is being rendered on your page.


## Step 3: Database Setup


1. Use `npm` to install `mongoose`.  Save it as a dependency of your project with `--save`.

1. In `models/album.js`, add a schema and a model for our albums.  Determine the attributes and data types for the schema based on the sample data we've been using.

1. Export the `Album` model in `models/album.js`.

1. Require the `Album` model in `models/index.js`.  Then add it into the `exports` object for `models/index.js`. Inside the `exports` object, the key should be "Album" and the value should be the `Album` model.


  <details><summary>click to see a completed `models/albums.js`</summary>

  ```js
  //models/album.js
  var AlbumSchema = new Schema({
    artistName: String,
    name: String,
    releaseDate: String,
    genres: [ String ]
  });

  var Album = mongoose.model('Album', AlbumSchema);

  module.exports = Album;
  ```

  </details>

  <details><summary>click to see a completed `models/index.js`</summary>

  ```js
  module.exports.Album = require("./album.js");
  ```

  </details>


## Step 4: Seeding the database.

1. Move the hard-coded album data from `controllers/albumControllers.js` into `seed.js`.  You'll note there's already an empty variable there for you to use.  

1. Strip out the pre-coded `_id` properties, as MongoDB will take care of creating these for us.

1. Make sure `mongod` is running in a tab of your terminal.

1. Run `node seed.js`.

1. Resolve any errors you encounter.

<details><summary>hint: `error connect ECONNREFUSED`</summary>
If you see an error like:

```
process.nextTick(function() { throw err; })
                              ^
Error: connect ECONNREFUSED 127.0.0.1:27017
```

This error usually means that `mongod` is not running.
</details>


## Step 5: Working with database data.

Now that the database is seeded, let's transition to using the database in our `/api/albums` route.

1. Delete the hard-coded server data in `controllers/albumsController.js`.

1. Require `./models` in `controllers/albumsController.js`.

1. Edit the current function `index` so that it accesses the database and pulls out all albums.

1. Verify that you're getting the right data on your home page now.  Your AJAX should still work. If the attribute names in the data have changed at all, you'll have to resolve that.

<details><summary>hint: requiring `./models`</summary>

```js
var db = require('./models');
```
</details>

## Sprint 1 Conclusion

**If you're stuck, take a look at the solutions branch for sprint 1**

If you've made it this far, then you've created an API that has an index route at `GET` `/api/albums`.

The app has a single-page view that makes a GET request to the API with AJAX and renders the information.  Our data is being **R**ead from the database by the server.

This completes the **Read** component of our **CRUD** app, for the moment.

**Good job!**
