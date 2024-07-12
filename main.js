// ==UserScript==
// @name         MonkeyType Quote Tracker/Queue
// @author       Brentspine

// @description  Track completed quotes and try to complete all of them. Download updates at: https://github.com/brentspine/monkeytype-quote-queue


// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @match        https://monkeytype.com/*
// @grant        none
// 
// ==/UserScript==

(async function() {
    'use strict';

    const START_TIMESTAMP = 1720647438000;
    const QUOTE_ID_NOTICE_INTERVAL = 200;

    // Quote Results do not store their source language. This means the program can't make out a difference between, for example, the german quote 42 and the english quote 42.
    // Before changing the language in the config, please make sure you have the correct language selected in MonkeyType
    const QUOTES_LANGUAGE = "english";
    
    const QUOTES_URL = `https://monkeytype.com/quotes/${QUOTES_LANGUAGE}.json`;
    const COMPLETED_QUOTES_URL = 'https://api.monkeytype.com/results';
    const LOCAL_STORAGE_KEY_PREFIX = 'bqp_';
    
    const STATES = ["loading", "login", "account", "typing", "result"];

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
        if(response.status > 299) {
        	alert(`Encountered a ${response.status} error while fetching quotes. Please check your configuration.`)
        	return null;
        }
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
        if(response.status == 401 || response.status == 403 || response.status == 404) {
        	alert(`Encountered a ${response.status} error. Please relogin or report an issue if the problem persists. Contact: github.com/brentspine`);
        	return null;
        }
        const data = await response.json();
        const r = data.data.filter(result => result.mode === 'quote').filter(result => result.timestamp > START_TIMESTAMP);
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"result_cache", JSON.stringify(r));
        return r;
    }

    function storeQuotesInLocalStorage(quotes) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}quotes_${QUOTES_LANGUAGE}`, JSON.stringify(quotes));
    }

    function getStoredQuotes() {
        const quotes = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}quotes_${QUOTES_LANGUAGE}`);
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
                const languagesButton = document.querySelector(`#testModesNotice button[commands="languages"]`);
                let selectedLang = "unknown";
                if(languagesButton !== null && languagesButton !== undefined) {
                	selectedLang = languagesButton.innerHTML.replace(`<i class="fas fa-globe-americas"></i>`, "");
                }
                alert(`Couldn't find quote with id ${quoteId} while activating. Do you have the correct language selected? Config Language: ${QUOTES_LANGUAGE}, Selected Language: ${selectedLang}`);
                return;
            }
            const quote_button = document.querySelector(`#testConfig button[mode="quote"]`);
        	doClick(quote_button);
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

	async function waitForAnyState(desiredStates, checkInterval = 100) {
	    return new Promise(resolve => {
	        const checkState = () => {
	            if (!desiredStates.includes(getMtState())) {
	                setTimeout(checkState, checkInterval);
	            } else {
	                resolve();
	            }
	        };
	        checkState();
	    });
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
                    	alert("Auth token not found in firebaseLocalStorageDb, please reload the page or report an issue if the problem persists. Contact: github.com/brentspine")
                        reject('Auth token not found');
                    }
                };
            };
        });
    }

    function getMtState() {
    	const pageLoading = document.getElementById("pageLoading");
        const typingTest = document.getElementById("typingTest");
        const pageAccount = document.getElementById("pageAccount");
        const result = document.getElementById("result");
        const pageLogin = document.getElementById("pageLogin");
        
        if(pageLoading !== null && pageLoading !== undefined) return "loading";
        if(pageLogin !== null && pageLogin !== undefined) {
        	const pageLoginOpacity = getStyleOfObjectFloat(pageLogin, "opacity");
    		if(pageLoginOpacity > 0) return "login";
        }
        if(typingTest === null || typingTest === undefined) return "account";
        const typingTestOpacity = getStyleOfObjectFloat(typingTest, "opacity");
        if(typingTestOpacity > 0) return "typing";
        const pageAccountOpacity = getStyleOfObjectFloat(pageAccount, "opacity");
        if(pageAccountOpacity > 0) return "account";
        return "result";
    }
    
    function isModeActive(mode) {
    	return document.querySelector(`#testConfig button[mode="${mode}"].active`) !== null;
    }

    let authToken;
    async function main() {
    	if(getMtState() == "login") {
    		await waitForAnyState(STATES.filter(s => s !== "loading" && s !== "login"));
    		setTimeout(function() {
    			console.log("Reloading after login");
    			window.location.reload();
    		}, 1000);
    		return;
    	}
    	await waitForAnyState(STATES.filter(s => s !== "loading" && s !== "login"));
    	authToken = await getAuthToken();
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
    	const mtState = getMtState();
    	if(mtState !== "typing" && mtState !== "result") return;
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

	localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"quote_init", false);
    setTimeout(main, 1000);
    setInterval(function() {
        if(getMtState() !== "typing") return;
        if(localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"quote_init") == "false") {
        	nextQuote();
        	localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"quote_init", true);
        	console.log("Quote Init");
        }
        if(!isModeActive("quote")) return;
        var quoteId = null;
        const premid = document.getElementById("premidTestMode");
        if(premid === undefined || premid === null) {
        	quoteId = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"last_quote_id");
        	if(quoteId === undefined || quoteId === null) return;
        } else {
        	const numberStr = premid.innerHTML.replace(/^\D+/, "");
        	quoteId = parseInt(numberStr, 10);
        }
        const quoteIdNotice = document.getElementById("quote-id-notice");
        if(quoteIdNotice !== null) {
        	const currentQuoteId = parseInt(quoteIdNotice.innerHTML.replace(/^\D+/, ""), 10);
        	if(quoteId == currentQuoteId) return;
        	quoteIdNotice.innerHTML = `Quote ID: ${quoteId}`;
        	localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"active_quote", quoteId);
        	return;
        }
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX+"active_quote", quoteId);
        var newButton = `<button class="textButton" id="quote-id-notice">Quote ID: ${quoteId}</button>`;
        document.getElementById("testModesNotice").innerHTML += newButton;
        document.getElementById("quote-id-notice").addEventListener("click", function() {
        	var quoteId = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"last_quote_id");
        	if(quoteId === null || quoteId === undefined) return;
        	var activeQuote = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX+"active_quote");
        	if(activeQuote === null) {
        		startNextQuote(parseInt(quoteId));
        		return;
        	}
        	activeQuote = parseInt(activeQuote);
        	if(activeQuote == quoteId) return;
        	startNextQuote(parseInt(quoteId));
        });
    }, QUOTE_ID_NOTICE_INTERVAL);
})();
