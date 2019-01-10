
if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('service-worker.js');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

function showAddAppPrompt () {

// Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });


}

function loadFeed (rssurl,templateId) {

console.debug("loading: " + rssurl)

$.get(rssurl, function(data) {

    $('#output').empty();
    var $xml = $(data);

    var siteTitle;

    $xml.find("title:first").each(function() {
	siteTitle = $(this).text();
    });

     var tmpl = $.templates(templateId); // Get compiled template

    var idx = 0;

    $xml.find("item").each(function() {
       var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                guid: idx++,
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
                author: $this.find("author").text(),
		content: $this.find("content\\:encoded").text(),
		imageSrc: $this.find("media\\:content").attr("url"),
		imageDesc: $this.find("media\\:description").text(),
		enclosure: $this.find("enclosure").attr("url"),
		enclosureType: $this.find("enclosure").attr("type"),
		category: siteTitle
        }

	console.debug(item.enclosureType);
	if (item.enclosureType === "image/jpeg"){
		item.imageSrc = item.enclosure;
		item.enclosure = "";
        }	
		

    	var html = tmpl.render(item);
	$('#output').append(html);
    });
});

}

