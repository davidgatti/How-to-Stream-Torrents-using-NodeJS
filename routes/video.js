let fs = require("fs")
let path = require("path");
let express = require('express');
let WebTorrent = require('webtorrent')

let router = express.Router();

//
//	1.	When the server starts create a WebTorrent client
//
let client = new WebTorrent();

//
//	2.	The object that holds the client stats to be displayed in the front end
//	using an API call every n amount of time using jQuery.
//
let stats = {
	progress: 0,
	downloadSpeed: 0,
	ratio: 0
}

//
//	3.	The variable that holds the error message from the client. Farly crude but
//		I don't expect to much happening hear aside the potential to add the same
//		Magnet Hash twice.
//
let error_message = "";

//
//	4.	Listen for any potential client error and update the above variable so
//		the front end can display it in the browser.
//
client.on('error', function(err) {

	error_message = err.message;

});

//
//	5.	Emitted by the client whenever data is downloaded. Useful for reporting the
//		current torrent status of the client.
//
client.on('download', function(bytes) {

	//
	//	1.	Update the object with fresh data
	//
	stats = {
		progress: Math.round(client.progress * 100 * 100) / 100,
		downloadSpeed: client.downloadSpeed,
		ratio: client.ratio
	}

});

//
//	API call that adds a new Magnet Hash to the client so it can start
//	downloading it.
//
//	magnet 		-> 	Magnet Hash
//
//	return 		<-	An array with a list of files
//
router.get('/add/:magnet', function(req, res) {

	//
	//	1.	Extract the magnet Hash and save it in a meaningful variable.
	//
	let magnet = req.params.magnet;

	//
	//	2.	Add the magnet Hash to the client
	//
	client.add(magnet, function (torrent) {

		//
		//	1.	The array that will hold the content of the Magnet Hash.
		//
		let files = [];

		//
		//	2.	Loop over all the file that are inside the Magnet Hash and add
		//	them to the above variable.
		//
		torrent.files.forEach(function(data) {

			files.push({
				name: data.name,
				length: data.length
			});

		});

		//
		//	->	Once we have all the data send it back to the browser to be
		//		displayed.
		//
		res.status(200)
		res.json(files);

	});

});

//
//	The API call to start streaming the selected file to the video tag.
//
//	magnet 		-> 	Magnet Hash
//	file_name 	-> 	the selected file name that is within the Magnet Hash
//
//	return 		<-	A chunk of the video file as buffer (binary data)
//
router.get('/stream/:magnet/:file_name', function(req, res, next) {

	//
	//	1.	Extract the magnet Hash and save it in a meaningful variable.
	//
	let magnet = req.params.magnet;

	//
	//	2.	Returns the torrent with the given torrentId. Convenience method.
	//		Easier than searching through the client.torrents array. Returns
	//		null if no matching torrent found.
	//
	var tor = client.get(magnet);

	//
	//	3.	Variable that will store the user selected file
	//
	let file = {};

	//
	//	4.	Loop over all the files contained inside a Magnet Hash and find the one
	//		the user selected.
	//
	for(i = 0; i < tor.files.length; i++)
	{
		if(tor.files[i].name == req.params.file_name)
		{
			file = tor.files[i];
		}
	}

	//
	//	5.	Save the range the browser is asking for in a clear and
	//		reusable variable
	//
	//		The range tells us what part of the file the browser wants
	//		in bytes.
	//
	//		EXAMPLE: bytes=65534-33357823
	//
	let range = req.headers.range;

	console.log(range);

	//
	//	6.	Make sure the browser ask for a range to be sent.
	//
	if(!range)
	{
		//
		// 	1.	Create the error
		//
		let err = new Error("Wrong range");
			err.status = 416;

		//
		//	->	Send the error and stop the request.
		//
		return next(err);
	}

	//
	//	7.	Convert the string range in to an array for easy use.
	//
	let positions = range.replace(/bytes=/, "").split("-");

	//
	//	8.	Convert the start value in to an integer
	//
	let start = parseInt(positions[0], 10);

	//
	//	9.	Save the total file size in to a clear variable
	//
	let file_size = file.length;

	//
	//	10.	IF 		the end parameter is present we convert it in to an
	//				integer, the same way we did the start position
	//
	//		ELSE 	We use the file_size variable as the last part to be
	//				sent.
	//
	let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;

	//
	//	11.	Calculate the amount of bits will be sent back to the
	//		browser.
	//
	let chunksize = (end - start) + 1;

	//
	//	12.	Create the header for the video tag so it knows what is
	//		receiving.
	//
	let head = {
		"Content-Range": "bytes " + start + "-" + end + "/" + file_size,
		"Accept-Ranges": "bytes",
		"Content-Length": chunksize,
		"Content-Type": "video/mp4"
	}

	//
	//	13.	Send the custom header
	//
	res.writeHead(206, head);

	//
	//	14.	Create the createReadStream option object so createReadStream
	//		knows how much data it should be read from the file.
	//
	let stream_position = {
		start: start,
		end: end
	}

	//
	//	15.	Create a stream chunk based on what the browser asked us for
	//
	let stream = file.createReadStream(stream_position)

	//
	//	16.	Pipe the video chunk to the request back to the request
	//
	stream.pipe(res);

	//
	//	->	If there was an error while opening a stream we stop the
	//		request and display it.
	//
	stream.on("error", function(err) {

		return next(err);

	});

});

//
//	The API call that gets all the Magnet Hashes that the client is actually
//	having.
//
//	return 		<-	An array with all the Magnet Hashes
//
router.get('/list', function(req, res, next) {

	//
	//	1.	Loop over all the Magnet Hashes
	//
	let torrent = client.torrents.reduce(function(array, data) {

		array.push({
			hash: data.infoHash
		});

		return array;

	}, []);

	//
	//	->	Return the Magnet Hashes
	//
	res.status(200);
	res.json(torrent);

});

//
//	The API call that sends back the stats of the client
//
//	return 		<-	A object with the client stats
//
router.get('/stats', function(req, res, next) {

	res.status(200);
	res.json(stats);

});

//
//	The API call that gets errors that occurred with the client
//
//	return 		<-	A a string with the error
//
router.get('/errors', function(req, res, next) {

	res.status(200);
	res.json(error_message);

});

//
//	The API call to delete a Magnet Hash from the client.
//
//	magnet 		-> 	Magnet Hash
//
//	return 		<-	Just the status of the request
//
router.get('/delete/:magnet', function(req, res, next) {

	//
	//	1.	Extract the magnet Hash and save it in a meaningful variable.
	//
	let magnet = req.params.magnet;

	//
	//	2.	Remove the Magnet Hash from the client.
	//
	client.remove(magnet, function() {

		res.status(200);
		res.end();

	});

});

module.exports = router;
