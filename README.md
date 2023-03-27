Submission for chronicle.rip take home test

Run Development Mode
- make sure there's a mysql and redis service running and create ````.env```` file in ```/backend``` according to your environment, an example can be found at ```.env.example```
- cd to ```/backend``` run ```npm install``` and ```npx prisma migrate dev``` and then run ```npm run dev```, 
- in different terminal cd to ```/frontend``` and run ```npm install``` and ```npm start```
- frontend code can be accessed at http://localhost:4200 and backend code at http://localhost:3000

Run production Mode
- create ```.env``` at root folder with ```.env.example``` as an example on how to make it
- use ```docker-compose up -d``` in root folder.
- ```docker exec -it``` into "backend" docker container and run ```npx prisma migrate```
- restart "backend" service in docker-compose
- app can be accessed at http://localhost:8080 for the frontend and http://localhost:3001 for the backend