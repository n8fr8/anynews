
function loadFeed (rssurl) {

console.debug("loading: " + rssurl)


$.get(rssurl, function(data) {
    var $xml = $(data);

    $xml.find("title").each(function() {
    });

    $xml.find("item").each(function() {
       var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
                author: $this.find("author").text(),
		content: $this.find("content").text()
        }
	$('#output').append(item.title);
        //Do something with item here...
    });
});

}

