Project 1 Part 1
Team: 418Teapot
Members: Jiabei Yu (jy2793), Apoorv Purwar (ap3644), Yuval Schaal (ys3055), Will Pascucci (wmp2108), Guy Yardeni (gy2241)

Project Requirements:

Req: Use Swagger Editor to define and document REST APIs.
Status: Completed. We have used swagger to document our API's.

Req: Implement an Elastic Beanstalk application (microservice) for each resource that implements
the relevant REST API.
Status: Completed. 

Req:Each microservice should support
– GET and POST on resource, e.g. /Person
Status: Completed

– GET, PUT, DELETE on resource/id, e.g. /Person/dff9
Status: Completed

– Simple query, e.g. /Person?lastName=Ferguson
Status: Not supported

– Pagination
Status: Completed

– Relationship paths: /Person/dff9/address and /Addresses/someID/persons
Status: Completed

– HATEOAS links where appropriate.
Status: Completed

– Simple HTML/Angular demo UI.
Status: Completed

Usage Instructions:
In the frontend folder, make sure you have Grunt. Do an npm install and a bower install
Once dependencies are working, type grunt serve