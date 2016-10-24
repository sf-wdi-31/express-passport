# Sprint 6

## Overview

Now let's allow our users to update and delete songs.  We're going to create a new modal for the updating part.

Here's a rough idea of what the view could look like:

![Edit Songs Modal](/docs/assets/images/edit_songs.png)

> Make sure your modal's elements don't use the same ids as other modals on the page!

Objectives:

* allow users to edit songs
* allow users to delete songs
* practice more with Bootstrap modals

> Howdy! Good work, partner!
> If you're at sprint 6, you must be rarin' to go! We're gonna ask you to solve some problems on your own in this sprint.  
![cowboy](https://m.popkey.co/e5a568/7grXg.gif)

## Step 1: Modal for song updating.

Now might be a good time to take another look at the [bootstrap modal documentation](http://getbootstrap.com/javascript/#modals).

We'll create another modal in `index.html`.  Each time someone clicks a button to edit songs, we'll give the modal the current songs' information.  This won't be too hard since we're just going to replace the modal body (on the sample below, look for `#editSongsModalBody`).

1. Add a new modal to the page.  You can build your own OR [use the sample provided](/docs/code_samples/sprint6_modal.html).

	> If you're using the sample, take a look at the unique ids created on the elements.  We'll be using those later on.

1. Add a new button 'Edit Songs' in the `panel-footer` of each album row.

1. When 'Edit Songs' is clicked, open the modal!

	<details><summary>hint: opening a modal with Bootstrap's JavaScript</summary>

	```js
	$('#fooModal').modal('show');
	```

	</details>

## Step 2: Song List Edit/Delete Form(s)

1. Develop a form for editing the song list.  It should be able to (1) delete a song (2) edit each song (see a possible layout image above).  Your form should be in a Handlebars template.  

	> You can put the template anywhere in `index.html`.

1. Remember that in order to do a `DELETE /api/albums/:album_id/songs/:id` or a `PUT /api/albums/:album_id/songs/:id` you'll need those `id`s.  Track them as `data-` attributes in your form.

1. You may want to use a `GET /api/albums/:album_id/songs` index route to get all songs for a particular album.  This is likely easier than retrieving incomplete data from the page.

	> Sample HTML for the form <a href="/docs/code_samples/sprint6_inline_form.html">is provided for you</a>.  You can use this to help you develop your template.

  > If using the sample form or following the wireframe, note that you can make each row a separate form if you want.

## Step 3: Delete and Update Implementation

1. Create the server-side route for `DELETE /api/albums/:album_id/songs/:id`.

1. Write client-side JavaScript to delete a song from the form when the corresponding delete button is clicked. (Make sure the deleted text `<input>` is removed as well as the button.

1. Test delete for songs.

	> You may want [to read about subdocs](http://mongoosejs.com/docs/subdocs.html).  In particular, check out the section on finding subdocs and removing subdocs.

1. Ensure that the song list on the page (the main album row that contains this song) is updated as well.

	> You may want to re-retrieve the songs rather than trying to parse the current album `<li>` content.
	> It would be a good idea to make a function for this. It'll be useful in the next step.

## Step 4: Update  

Let's allow users to save their edits.

1. Create the server route and skeletal controller method for `PUT /api/albums/:album_id/songs/:id`.

1. After the user clicks a 'Save' button, make an AJAX  request to edit the song.

1. Finish the code to handle the request on the server-side, if you haven't yet.

1. Update the page with the changed song.

1. Make sure you test everything.

1. Make sure the song list form modal closes when the close button is clicked.

	> Ideally you would send each update, and after the responses for all the updates have been received; then you'd request the album and update the page.  This is a **super-super-stretch exercise and a really tough challenge** that would probably use a technology called promises.  Feel free to take the easier approach of just requesting the album and updating the page after every response to your PUT request.

## Step 5: Modal Everything

1. Add functionality so that the user can create new songs and have them added to the list from within the modal.


## Stretch Challenges

1. Add a _saving_ spinner or animation for each song when it is saving.

1. Save each song when the user leaves its input box.

1. Client-side validations: make sure `trackNumbers` are numbers & unique.  In displays, sort songs by `trackNumber`.

1. Consider using a Bootstrap theme.

1. Consider using Font Awesome.

1. Server-side validations: make sure track numbers are unique within each album.  


## Finally

If you got this far, we are SUPER impressed.  Congratulations!
