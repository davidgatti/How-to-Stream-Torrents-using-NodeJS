let fs = require("fs")
let path = require("path");
let express = require('express');
let WebTorrent = require('webtorrent')

let router = express.Router();

let client = new WebTorrent();

let db = {
	progress: 0,
	timeRemaining: 0,
	downloadSpeed: 0,
	received: 0
}

//
//	Add the torrent and start downloading it.
//
router.get('/add/:magnet', function(req, res) {

	let magnet = "magnet:?xt=urn:btih:" + req.params.magnet;

	//
	//	Add torrent to the queue
	//
	client.add(magnet, function (torrent) {

		//
		//	Content of the Magnet URL
		//
		let files = [];

		//
		//	Extract all the files form the Magnet URL
		//
		torrent.files.forEach(function(data) {

			files.push({
				name: data.name,
				length: data.length
			});

		});

		//
		//	Emitted whenever data is uploaded. Useful for reporting the current
		//	torrent status.
		//
		torrent.on('upload', function() {

			//
			//	Detect when we have uploaded the torrent
			//
			if(torrent.length == torrent.downloaded)
			{
				//
				//	Destroy the client, including all torrents and connections
				//	to peers
				//
				torrent.destroy();
			}

		});

		//
		//	Emitted whenever data is downloaded. Useful for reporting the
		//	current torrent status, for instance:
		//
		torrent.on('download', function(bytes) {

			db = {
				progress: Math.round(torrent.progress * 100 * 100) / 100,
				timeRemaining: new Date(torrent.timeRemaining).toLocaleTimeString(),
				downloadSpeed: torrent.downloadSpeed,
				received: torrent.received
			}

		})

		//
		//	->	Just say it is ok.
		//
		res.status(200)
		res.json(files);

	});

});

//
//	Stream the video
//
router.get('/stream/:magnet/:file_name', function(req, res, next) {

	let magnet = "magnet:?xt=urn:btih:" + req.params.magnet;

	//
	//	Returns the torrent with the given torrentId. Convenience method.
	//	Easier than searching through the client.torrents array. Returns null
	//	if no matching torrent found.
	//
	var tor = client.get(magnet);

	//
	//	Extract the biggest file from the basket
	//
	var file = getLargestFile(tor, req.params.file_name);

	//
	//	2.	Save the range the browser is asking for in a clear and
	//		reusable variable
	//
	//		The range tells us what part of the file the browser wants
	//		in bytes.
	//
	//		EXAMPLE: bytes=65534-33357823
	//
	let range = req.headers.range;

	//
	//	3.	Make sure the browser ask for a range to be sent.
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
	//	4.	Convert the string range in to an array for easy use.
	//
	let positions = range.replace(/bytes=/, "").split("-");

	//
	//	5.	Convert the start value in to an integer
	//
	let start = parseInt(positions[0], 10);

	//
	//	6.	Save the total file size in to a clear variable
	//
	let file_size = file.length;

	//
	//	7.	IF 		the end parameter is present we convert it in to an
	//				integer, the same way we did the start position
	//
	//		ELSE 	We use the file_size variable as the last part to be
	//				sent.
	//
	let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;

	//
	//	8.	Calculate the amount of bits will be sent back to the
	//		browser.
	//
	let chunksize = (end - start) + 1;

	//
	//	9.	Create the header for the video tag so it knows what is
	//		receiving.
	//
	let head = {
		"Content-Range": "bytes " + start + "-" + end + "/" + file_size,
		"Accept-Ranges": "bytes",
		"Content-Length": chunksize,
		"Content-Type": "video/mp4"
	}

	//
	//	10.	Send the custom header
	//
	res.writeHead(206, head);

	//
	//	11.	Create the createReadStream option object so createReadStream
	//		knows how much data it should be read from the file.
	//
	let stream_position = {
		start: start,
		end: end
	}

	//
	//	12.	Create a stream chunk based on what the browser asked us for
	//
	let stream = file.createReadStream(stream_position)

	stream.pipe(res);

	//
	//	->	If there was an error while opening a stream we stop the
	//		request and display it.
	//
	stream.on("error", function(err) {

		return next(err);

	});

});

router.get('/list', function(req, res, next) {

	let torrent = client.torrents.reduce(function(array, data) {

		array.push({
			hash: data.infoHash
		});

		return array;

	}, []);

	res.status(200);
	res.json(torrent);

});

router.get('/stats', function(req, res, next) {

	res.status(200);
	res.json(db);

});

//
//	Delete torrent
//
router.get('/delete/:magnet', function(req, res, next) {

	let magnet = "magnet:?xt=urn:btih:" + req.params.magnet;

	//
	//	Remove a torrent from the client. Destroy all connections to peers
	//	and delete all saved file data. If callback is specified, it will be
	//	called when file data is removed.
	//
	client.remove(magnet, function() {

		client.destroy(function() {

			res.status(200);
			res.end();

		});

	});

});

//
//
//
function getLargestFile(torrent, file_name) {

	let file;

	for(i = 0; i < torrent.files.length; i++)
	{
		if(torrent.files[i].name == file_name)
		{
			file = torrent.files[i];
		}
	}

	return file;
}

module.exports = router;
