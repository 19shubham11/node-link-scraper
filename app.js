//this is the implementation with Q module for promises

var request = require("request");
var cheerio = require ("cheerio");
var Q = require("q");
var moment = require('moment')
var fs = require('fs');

var links_arr = [];

var curr_time = moment().format("DDMMMYYYY_HH:mm:ss")
// no of concurrent requests
var concurrent_requests = 5;

var counter = concurrent_requests;
var activeRequests = 0;
var file = fs.createWriteStream(curr_time+".csv");

var url = 'http://www.medium.com/'

function scrapeURL (url){
	var d = Q.defer();
	activeRequests++;
		request(url , function(err,resp,body){
			if(err){
				console.log('Error:',err)
				d.reject(err)
			}
			else{
			var $ = cheerio.load(body);
			$('a').each(function() {
			var text = $(this).text();
			var link = $(this).attr('href');

			//check for duplicate links in the array
			if(link && link.includes('http') && link!==url  && !links_arr.includes(link) && link.match(/medium/) ){
				links_arr.push(link)
				file.write(link+'\n')
				}
			
			})

			d.resolve(links_arr)
		}

	})

	return d.promise
}


function concurrentRequests(link){
	console.log('activeRequests',activeRequests)
	scrapeURL(link)
	.done(function(){
		//links before links_arr[counter] have already been written
	if(counter !== links_arr.length){
		concurrentRequests(links_arr[counter]);
		 counter++;
		 activeRequests--;
		 if(activeRequests==0){
			console.log('Done!')
		 }
		}
	else{
		console.log('All links written to file')
	}	
	  
	})
  }


function looper(links_arr) {
	for(let i=0;i<concurrent_requests;i++) {
		concurrentRequests(links_arr[i]);
	}
}


console.log('...scraping',url)

scrapeURL(url)
.then(function(resp){
	activeRequests = 0
	// console.log('resp',resp)
	looper(resp)

},function(err){
	console.log('ERROR',err)
})



