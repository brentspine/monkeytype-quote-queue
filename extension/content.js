// We use external updates, as long as it's not listed on the Chrome Web Store
let vXhr = new XMLHttpRequest();
vXhr.onload = function() {
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		const script = document.createElement('script');
		script.textContent = this.responseText;
		document.head.appendChild(script);
	};
	const data = JSON.parse(this.responseText);
	const latest = data.extension;
	xhr.open('GET', 'https://brentspine.github.io/monkeytype-quote-queue/' + latest + '.js');
	xhr.send();
};
vXhr.open('GET', 'https://brentspine.github.io/monkeytype-quote-queue/versions.json');
vXhr.send();
