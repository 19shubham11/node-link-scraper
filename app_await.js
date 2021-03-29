//this is the implementation with Javascript's async await, works with node version 7 and above

var request = require('request');
var cheerio = require ('cheerio');
var moment = require('moment');
var fs = require('fs')

var links_arr = [];
var curr_time = moment().format("DDMMMYYYY_HH:mm:ss")

var activeRequests = 0

// no of concurrent requests
var concurrent_requests = 5;
var counter = concurrent_requests;

var file = fs.createWriteStream(curr_time+".csv");

var url = 'http://www.medium.com'

function scrapeURL (url){
	activeRequests++;

	return new Promise(function(resolve,reject){

		request(url , function(err,resp,body){
			if(err){
				reject(err)
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
				resolve(links_arr)
			}
		})
	})

}


async function concurrentRequests(link){
	console.log('activeRequests',activeRequests)

	try{
			let l = await scrapeURL(link)
			if(l && counter !== links_arr.length){
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
	}
	catch(e){

		console.log('Error',e)
	}

	 
  }


function looper(links_arr) {
	for(let i=0;i<concurrent_requests;i++) {
		concurrentRequests(links_arr[i]);
	}
}


async function call(url) {
	console.log('...scraping',url)
	try{
		let arr  = await scrapeURL(url)
		activeRequests = 0
		looper(arr)		
	}
	catch(e){
		console.log('Error',e)
	}

}


call(url)
