# Technical architecture of installation
## Software development
Simply put the software development on the piece can be divided into three main parts:
- rendering butterflies with three.js
- server and database part using node.js and mongoDB
- interaction (computer vision using depth cameras)

## Hardware 
![Hardware Architecture](../project_images/technology_architecture.jpg?raw=true "Hardware Architecture")
We'll be using more than one projector and computer. This will be soon clear when we find out more about the exhibition space. Anyways, the idea is to have one computer for rendering and projections, and another for interaction and its rendering.
Since at the moment we haven't found a solution for having multi-channel input in Web Speech API, we have to connect each microphone to a tablet and then send the wish to the server.


