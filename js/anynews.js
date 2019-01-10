
function loadFeed (rssurl) {

console.debug("loading: " + rssurl)

$.get(rssurl, function(data) {
    var $xml = $(data);

    $xml.find("title:first").each(function() {
	$("#site-title").text($(this).text());;
    });
    $xml.find("description:first").each(function() {
	$("#site-description").text($(this).text());
    });

    var tmpl = $.templates("#post-template"); // Get compiled template

    $xml.find("item").each(function() {
       var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
                author: $this.find("author").text(),
		content: $this.find("content\\:encoded").text(),
		imageSrc: $this.find("media\\:content").attr("url"),
		imageDesc: $this.find("media\\:description").text()
        }

    	var html = tmpl.render(item);
	$('#output').append(html);
    });
});

}

