### Project 1 Part 1

#### Team: 418Teapot

##### Members: Jiabei Yu (jy2793), Apoorv Purwar (ap3644), Yuval Schaal (ys3055), Will Pascucci (wmp2108), Guy Yardeni (gy2241)

---

## Project Requirements:

- [x] Use Swagger Editor to define and document REST APIs.
-- See Swagger API Documentation at [here](https://app.swaggerhub.com/home) 

- [x] Implement an Elastic Beanstalk application (microservice) for each resource that implements the relevant REST API.
    - [x] Person
    - [x] Address 

##### Req: Each microservice should support

- [x] GET and POST on resource, e.g. /Person
    - [x] Person
    - [x] Address 
- [x] GET, PUT, DELETE on resource/id, e.g. /Person/dff9
    - [x] Person
    - [x] Address 
- [x] Simple query, e.g. /Person?lastName=Ferguson
    - [x] Person
    - [x] Address 
- [x] Pagination
    - [x] Person
    - [x] Address 
- [x] Relationship paths: /Person/dff9/address and /Addresses/someID/persons
    - [x] Person
    - [x] Address 
- [x] HATEOAS links where appropriate.
    - [x] Person
    - [x] Address 
- [x] Simple HTML/Angular demo UI.

Usage Instructions:
In the frontend folder, make sure you have Grunt (npm install grunt).
Do an npm install and a bower install
Once dependencies are working, type grunt serve

