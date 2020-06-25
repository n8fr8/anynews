var FeedParser = require('feedparser');
var fetch = require('node-fetch'); // for fetching the feed

const fs = require('fs')
const { exec } = require("child_process");

var channelName = "yourpage.html";
var req = fetch('https://www.youtube.com/feeds/videos.xml?channel_id=SOMEYOUTUBECHANNEL')
var feedparser = new FeedParser();

req.then(function (res) {
  if (res.status !== 200) {
    throw new Error('Bad status code');
  }
  else {
    // The response `body` -- res.body -- is a stream
    res.body.pipe(feedparser);
  }
}, function (err) {
  // handle any request errors
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  var streamOut = fs.createWriteStream(channelName);

	streamOut.once('open', function(fd) {

		streamOut.write("<html><style>body { background-color:#000000; color:#ffffff;  }</style> <body>\n\n ");

  	while (item = stream.read()) {
	          //console.log(JSON.stringify(item, ' ', 4));

	//console.log("thumbnail: " + item["media:group"]["media:thumbnail"][0].url);
	       const mediaPath = "./" + item.guid + ".mp4";
         const mediaTitle =  item.title;

	  if (!fs.existsSync(mediaPath)) {
    	  exec("youtube-dl -f 18 " + item.link + " --output " + mediaPath, (error, stdout, stderr) => {
        		if (error) { console.log(`error: ${error.message}`); return; }
        		if (stderr) { console.log(`stderr: ${stderr}`); return; }

          		  exec("ipfs add " + mediaPath, (error, stdout, stderr) => {
            			  var ipfsHash = stdout.split(" ")[1];
            			  console.log(ipfsHash);

            			  streamOut.write("<h2>" + mediaTitle + "</h2>");
            			  streamOut.write('<video controls src="https://ipfs.io/ipfs/' + ipfsHash + '" width="620"></video>');
            			  streamOut.write("<br/><br/>");
                    if (error) { console.log(`error: ${error.message}`); return; }
                    if (stderr) { console.log(`stderr: ${stderr}`); return; }

          		   });

    	   });
       }

  }



});

});
