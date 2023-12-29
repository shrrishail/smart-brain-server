# SmartBrain - BACKEND

This project is an image processing application where users upload images and the system detects faces in them. The system is designed with Node.js and Express.js together forming the backbone of the server. The face detection feature is performed by a service provided by Clarifai, which we connect to, using their API.

To ensure the security of user data, we have put in place JWT (JSON Web Tokens) authentication. This system ensures only authorized users can upload images.

Data storage is taken care of by a Postgres database, while Redis is used as a cache to speed up frequent queries and operations. Currently Redis is being used in order to quickly fetch the user auth information.

The whole setup, which includes the server, the database and the cache, is containerized using Docker. Docker allows us to keep everything neatly organized and makes sure the system can be set up easily in different environments. This helps significantly simplify the process of deploying the system.

To run this project locally, follow the steps given below
1. Clone this repo
2. Install the docker application
3. Run `docker-compose up --build`
4. You must add your own API keys in the `.env` file to connect to the Clarifai API
5. Add your own database credentials to `server.js` line 12
6. When shutting down the project, run `docker-compose down`

You can grab Clarifai API key [here](https://www.clarifai.com/)

** Make sure you use postgreSQL instead of mySQL for this code base.

