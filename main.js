// ==UserScript==
// @name         MonkeyType Quote Tracker/Queue
// @author       Brentspine

// @description  Track completed quotes and try to complete all of them. Download updates at: https://github.com/brentspine/monkeytype-quote-queue


// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://monkeytype.com/*
// @grant        none
// 
// ==/UserScript==

(async function() {
    'use strict';

    const QUOTES_URL = 'https://monkeytype.com/quotes/english.json';
    const COMPLETED_QUOTES_URL = 'https://api.monkeytype.com/results';
    const LOCAL_STORAGE_KEY_PREFIX = 'bqp_';
    const START_TIMESTAMP = 1720647438000;

    function getStyleOfObjectFloat(object, styleType) {
        if (object && object.style) {
            const opacity = parseFloat(object.style.opacity);
            if (!isNaN(opacity)) {
              return opacity;
            }
        }
        return 0;
    }
    
    async function fetchQuotes() {
        const response = await fetch(QUOTES_URL);
        const data = await response.json();
        return data.quotes;
    }

    async function fetchCompletedQuotes(authToken) {
        const response = await fetch(COMPLETED_QUOTES_URL, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if(response.status == 429) {
        	console.log("Encountered 429, assuming next quote");
        	return null;
        }
        const data = await response.json();
        const r = data.data.filter(result => result.mode === 'quote').filter(result => result.timestamp > START_TIMESTAMP);
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"result_cache", JSON.stringify(r));
        return r;
    }

    function storeQuotesInLocalStorage(quotes) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}quotes`, JSON.stringify(quotes));
    }

    function getStoredQuotes() {
        const quotes = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}quotes`);
        return quotes ? JSON.parse(quotes) : null;
    }

    function getCompletedQuoteIds(completedQuotes) {
    	if(completedQuotes === null) return null;
        return completedQuotes.map(result => parseInt(result.mode2, 10));
    }

    function getNextQuoteId(allQuotes, completedQuoteIds, min_id=0) {
        for (const quote of allQuotes) {
            if (!completedQuoteIds.includes(quote.id) && quote.id >= min_id) {
                return quote.id;
            }
        }
        return null;
    }

    function getClickEvent() {
        return new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
    }

    function doClick(element) {
        element.dispatchEvent(getClickEvent());
    }

    function startNextQuote(quoteId, attempt=1) {
        let quoteElement = document.querySelector(`.searchResult[data-quote-id="${quoteId}"]`);
        
        if (quoteElement === null) {
            console.log(`Quote not loaded, attempt ${attempt}`);
            if(attempt >= 3) {
                console.log("Next quote: Failed after 3 attempts");
                return;
            }
            const search_button = document.querySelector(`#testConfig button[quotelength="-2"]`);
            console.log("Triggering click on search_button:");
            doClick(search_button);
            document.getElementById("searchBox").value = quoteId;
            setTimeout(function() {startNextQuote(quoteId, attempt+1)}, attempt*500);
            return;
        }

        doClick(quoteElement);
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"last_quote_id", quoteId);
        console.log(`Triggered click for quote ID: ${quoteId}`);
    }

    async function getAuthToken() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open('firebaseLocalStorageDb');

            openRequest.onerror = () => reject(openRequest.error);
            openRequest.onsuccess = () => {
                const db = openRequest.result;
                const transaction = db.transaction('firebaseLocalStorage', 'readonly');
                const store = transaction.objectStore('firebaseLocalStorage');
                const request = store.getAll();

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    const result = request.result.find(entry => entry.fbase_key.startsWith('firebase:authUser:'));
                    if (result) {
                        resolve(result.value.stsTokenManager.accessToken);
                    } else {
                        reject('Auth token not found');
                    }
                };
            };
        });
    }

    function getMtState() {
        const typingTest = document.getElementById("typingTest");
        if(typingTest === null || typingTest === undefined) return "result";
        const typingTestOpacity = getStyleOfObjectFloat(typingTest, "opacity");
        if(typingTestOpacity > 0) return "typing";
        return "result";
    }

    const authToken = await getAuthToken();
    async function main() {
    	localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"last_quote_id", null);
        let newButton = document.getElementById("saveScreenshotButton").outerHTML;
        newButton = newButton
            .replaceAll("saveScreenshotButton", "nextQuoteButton")
            .replaceAll(`<i class="far fa-fw fa-image"></i>`, `>>`)
            .replaceAll("Copy screenshot to clipboard", "Jump to next quote in queue");

        document.querySelector("#result .bottom .buttons").innerHTML += newButton;
        document.getElementById("nextQuoteButton").addEventListener("click", function() {
            nextQuote();
        });

        nextQuote();
    }

    async function nextQuote() {
        let quotes = getStoredQuotes();
        if (!quotes) {
            quotes = await fetchQuotes();
            storeQuotesInLocalStorage(quotes);
        }
        
        let nextQuoteId = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"last_quote_id");
        if(nextQuoteId === null || nextQuoteId === undefined || isNaN(nextQuoteId)) {
        	const completedQuotes = await fetchCompletedQuotes(authToken);
        	if(completedQuotes === null) {
        		alert(`429 on results AND no stored last quote. You can set the last quote ID manually using: "localStorage.setItem('${LOCAL_STORAGE_KEY_PREFIX}last_quote_id', SOME_ID_HERE)`);
        		return;
        	}
        	const completedQuoteIds = getCompletedQuoteIds(completedQuotes);
			nextQuoteId = parseInt(getNextQuoteId(quotes, completedQuoteIds));
        } else {
        	const minId = parseInt(nextQuoteId) + 1;
        	const resultCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"result_cache"));
        	const completedQuoteIds = getCompletedQuoteIds(resultCache);
        	nextQuoteId = getNextQuoteId(quotes,completedQuoteIds,minId);
        }
        if(quotes[quotes.length - 1].id < nextQuoteId) {
        	console.log('All quotes completed!');
        	return;
        }
        
        if (nextQuoteId !== null) {
            startNextQuote(nextQuoteId);
        } else {
            console.log('All quotes completed! (Probably)');
        }
    }

    setTimeout(main, 1000);
    setInterval(function() {
        //console.log(getMtState());
    }, 500);
})();
