const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
/* Fetch URLs from JSON */
fetch('urls.json').then((res) => {
	res.text().then((data) => {
		var frag = document.createDocumentFragment()
		var hasBegun = true
		JSON.parse(data).urls.forEach((feedUrl) => {
			console.debug('fetching: ' + feedUrl);
					/* Fetch the RSS Feed */
					fetch(feedUrl).then((res) => {
						res.text().then((xmlTxt) => {
							/* Parse the RSS Feed and display the content */
							try {
								let doc = DOMPARSER(xmlTxt, "text/xml")
								var title = doc.querySelector('title').textContent;
								let heading = document.createElement('h1')
								heading.textContent = title;
								frag.appendChild(heading)
								doc.querySelectorAll('item').forEach((item) => {
									let temp = document.importNode(document.querySelector('template').content, true);
									let i = item.querySelector.bind(item)
									let t = temp.querySelector.bind(temp)
									t('h2').textContent = !!i('title') ? i('title').textContent : '-'
									t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : i('guid').textContent
									t('p').innerHTML = !!i('description') ? i('description').textContent : '-'
									//t('p').innerHTML = !!i('content:encoded') ? i('content:encoded').textContent : '-'
									t('h3').textContent = i('pubDate').textContent;
									frag.appendChild(temp)
								})
							} catch (e) {
								console.error('Error in parsing the feed')
								console.error(e);
							}
							if(hasBegun) {
								document.querySelector('output').textContent = ''; 
								hasBegun = false;
							}
							document.querySelector('output').appendChild(frag)
						})
					}).catch(() => console.error('Error in fetching the RSS feed'))
				})
	})
}).catch(() => console.error('Error in fetching the URLs json'))
