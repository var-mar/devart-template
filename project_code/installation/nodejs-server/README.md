NODE server 
================================

Usage:

1. Open database:
mongod --dbpath data/db

(You need mongo open at port 27017)

2. Open server 
cd nodejs-server
npm install
node serverScreen.js

Descripton:
- Render butterfly textures
- Store wishes in mongodb
- Comunication UDP and websockets with socket.io

Dependencies:

- Analysis emotions depends on Saif Mohammad research. To get a copy lexicon copy go to fill a form in author website and agree in his terms of usage:
http://www.saifmohammad.com/WebPages/ResearchInterests.html  => File in json goes in 'data/' folder with name 'emotion-lexicon.json'