# 💥SUPERCHAT

Live at: https://frozen-sands-32597.herokuapp.com/

### Info

Originally made as part of ['The Complete Node.js Developer Course (2nd Edition)'](https://www.udemy.com/the-complete-nodejs-developer-course-2/) by Andrew Mead on Udemy.

Things added since the barebones application from the course:

* A more playful and cohesive theme, lots of emojis! 😄
* Markdown and Twemoji support for chat messages.
* Buttons to send random GIFs and dog pictures!
* Image embedding.
* Private messaging to other users in the same room.
* Slash commands!
* Added lowdb to save messages, newly connected users get sent the latest messages to the channel.
* A popular rooms list on the landing page, showing the top 5 rooms by users. They get added as suggestions to join in a dropdown as well.
* Usernames are unique and case-insensitive. Chatrooms kind of are too.
* Ways to change chatroom without going back to the landing page.
* Save users latest username and chatroom via cookie.

### TODO

Big maybes on all of these.

* Fix chatrooms to be properly case-insensitive by handling the comparison separately from the joining.
* Perhaps add a realtime collaborative drawingpad for each chatroom. Apparently not that hard?
* Change the context of the message form if you click a user in the sidebar to send PMs.
