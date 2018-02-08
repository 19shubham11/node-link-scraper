var request = require("request");
var cheerio = require ("cheerio");
var Q = require("q");
var fs = require('fs');

var links_arr = [];

// no of concurrent requests
var concurrent_requests = 5;
var counter = concurrent_requests;
var activeRequests = 0;
var file = fs.createWriteStream('output.csv');


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



function concurrentRequests(links){
	console.log('activeRequests',activeRequests)
  	scrapeURL(links)
  	.done(function(){
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

var url = 'http://www.medium.com/'
console.log('...scraping',url)

scrapeURL(url)
.then(function(resp){
	activeRequests = 0
	//homepage
	// console.log('resp',resp)
	looper(resp)
	//make looper async

},function(err){
	console.log('ERROR',err)
})






