# Tune.ly Sprint 5

## Overview

Let's allow users to edit album information.  

This sprint we will:

* make it so users can edit each album  
* add a `PUT /api/albums/:id` route to the server


> Note: if you get stuck going through this, make use of the hints, your neighbors, and the solutions for sprint 5.

> You must complete all of the previous sprint before starting this sprint (excluding stretch challenges).

> In this sprint, you will probably notice the instructions are more succinct; we're hoping that you're starting to feel more comfortable and developing more resourcefulness and independence.  Still, if you get stuck, it's ok to ask for help.

## Step 1: Edit Button

We're going to add a button that allows our users to edit an album.

1. Add a new button to each `panel-footer` in the Handlebars template.

  ```html
  <button class='btn btn-info edit-album'>Edit Album</button>`
  ```

1. Use jQuery to react to clicks on these buttons and determine the correct `album-id`.  Then `console.log` it.

1. When the `Edit` button is clicked, replace it with a `Save Changes` button. Remember to reverse this change when the edit is finished.

1. Also replace the major fields on the album with `input` elements.


Confused? How about a wire-frame from the UX department to sort things out:

##### Before clicking on "Edit Album"

![before clicking edit album](assets/albums/tunely_edit_album_example.png)

##### After clicking on "Edit Album"

![after clicking edit album](assets/albums/tunely_edit_album_after_click_example.png)


> Hint: you could have 2 buttons in place already, 1) "Edit", 2) "Save changes" and simply toggle their visibility with [$.toggle](http://api.jquery.com/toggle/)

> Note: this step could be a little tricky, especially if you want to display the current values in the input fields.  You'll have to get the text from the page, then replace the text with input elements.  


## Step 2: Client Side JavaScript

1. When `Save Changes` is clicked, handle that event on the client side.

1. Prepare an AJAX call to the server at `PUT /api/albums/:id`.


## Step 3: Route

1. Add the `app.put` method for the `/api/albums/:id` path on the server.  

1. Use the album controller's `update` method as the callback. Ensure that it updates the album in the database.

#### Step 3.5: Display updated data.


1. Make any final changes to your AJAX, and test everything.

1. Make sure you are removing the form fields and replacing them with updated data from the server.
  * You should do this when you get a response to your PUT request.
  * Use the response data from the PUT request.

> Hint: you already have a render function, ね(ne)?



## Stretch Challenges

1. When one album edit is in progress, disable or hide the other edit buttons.

1. Add a new modal for editing instead of letting the user make changes directly in the album row.

1. Add a cancel button for the edits.
