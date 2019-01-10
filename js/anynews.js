
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

function loadFeed (rssurl,templateName) {

console.debug("loading: " + rssurl)

$.get(rssurl, function(data) {
    var $xml = $(data);

    var siteTitle;

    $xml.find("title:first").each(function() {
	siteTitle = $(this).text();
    });

    var tmpl = $.templates("#"+templateName); // Get compiled template

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
		imageDesc: $this.find("media\\:description").text(),
		category: siteTitle
        }

    	var html = tmpl.render(item);
	$('#output').append(html);
    });
});

}

