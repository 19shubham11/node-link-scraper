# Link Scraper

This is a basic link scraper running on Node js.

## Working
* This application scrapes all the hyperlinks from a webpage and keeps doing the same recursively until all possible links have been found. 
* The same links are written to a csv file simultaneously.
* In the recursive calls , the maximum number of requests can be limited. 
* For the implementation , I have used request for http requests and cheerio for DOM parsing in Node.

## Demo
* Clone the Repository.
* Run `npm install` to install all dependencies
* Run `node app.js` , on the console you will see the current active http connections until all the links have been written to the file. 


The same function can be extended as the response of an API , and the name of the website to be scraped can be read from client side.
