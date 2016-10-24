# Tune.ly Sprint 4

## Overview

We've now finished **Create** and **Read**. It's time to move toward **Update** and **Delete**.  

This sprint we will:
* Add a button to delete an album.

> Note: if you get stuck going through this, make use of the hints, your neighbors, and the solutions for sprint 4.

> You must complete all of the previous sprint before starting this sprint (excluding stretch challenges).


## Step 1: Delete Buttons

Once again, let's start on the front end by adding a button to delete an album.  

1. Add another button to the `panel-footer` of the Handlebars template.

1. Use jQuery to listen for the `click` event for the button.

1. In your `click` event handler,  determine the album id of the target album to be deleted.  Just `console.log` it for now.

> Pro tip: Notice how we usually just `console.log` things at the beginning?  Testing each little bit of code as you go reduces the amount of code that you're uncertain about.

## Step 2: Delete Route

Let's add a route for `DELETE /api/albums/:id` to our server.

1. Add the new route on the server side, and start filling in the corresponding method in the albums controller. Start by having the  method `console.log` the album id and respond with a [200 or 204 status code](http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete).

  > HTTP DELETE often [doesn't have a defined body.](http://tools.ietf.org/html/rfc7231#section-4.3.5)

1. Find the `_id` for an album that exists in your database, and use it to test your route with curl or postman.

1. Connect this route's behavior to the database, and have it delete the specified album.  Test the route's response again, and make sure the album has been deleted from the database.


## Step 3: Connection

Now you can tie the previous front-end and back-end changes together.  

1. When a user clicks the delete button, send a DELETE request to the server and remove the album from the page.

  > Note jQuery doesn't have a `$.delete` method.  Use `$.ajax`.

1. In the client-side code, remove the deleted album from the page.

1. Refresh the page to get the full list of albums back, and make sure albums are truly being deleted.

> If you run out of things to delete, try re-seeding your database.


## Stretch Challenges

1. Prompt the user with an alert asking "Are you sure?" when they click delete. Only proceed if they confirm.  

1. Add an animation for album deletion.
