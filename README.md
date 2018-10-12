# Tweeter Project

Tweeter is a simple, single-page Twitter clone.

The user is able to create tweets and like/unlike them. Clicking on the compose button will make an animated "new tweets" element appear.

## Final Product

![screenshot of URLs page](https://github.com/johnbxu/tweeter/blob/master/docs/Home%20Page%20Narrow%20Viewport.png)
![screenshot of composing a tweet](https://github.com/johnbxu/tweeter/blob/master/docs/Compose%20Tweet%20Full-width.png)

## Dependencies

- Node 5.10.x or above
- Express
- Body-parser
- Chance
- Express
- Mongodb

## Getting Started

1. Install all dependencies (using `npm install`)
2. Run the development web server using `node index.js`

## Notes:
* You will need to create a .env file in the root directory that includes the port and URI for MongoDB like such:
```
MONGODB_URI=mongodb://127.0.0.1:27017/tweets
PORT=5000
```
Alternatively, change the PORT and MONGODB_URI variables in index.js manually.