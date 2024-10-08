const VERSION_ID = "2.0.4"

const MonkeyStates = Object.freeze({
    LOADING: "Loading Page",
    ACCOUNT: "Account Page",
    IDLE: "Idling",
    TYPING: "Typing Test",
    RESULT: "Test Result",
    LOGIN: "Login Page"
});

const MonkeyLanguages = Object.freeze({
    AFRIKAANS: "afrikaans",
    ALBANIAN: "albanian",
    ARABIC: "arabic",
    BANGLA: "bangla",
    BELARUSIAN: "belarusian",
    BELARUSIAN_LACINKA: "belarusian_lacinka",
    BULGARIAN: "bulgarian",
    CHINESE_SIMPLIFIED: "chinese_simplified",
    CODE_ARDUINO: "code_arduino",
    CODE_ASSEMBLY: "code_assembly",
    CODE_C: "code_c",
    CODE_CPLUSPLUS: "code_c++",
    CODE_CSHARP: "code_csharp",
    CODE_CSS: "code_css",
    CODE_CUDA: "code_cuda",
    CODE_GO: "code_go",
    CODE_JAVA: "code_java",
    CODE_JAVASCRIPT: "code_javascript",
    CODE_JULIA: "code_julia",
    CODE_KOTLIN: "code_kotlin",
    CODE_LUA: "code_lua",
    CODE_NIM: "code_nim",
    CODE_PHP: "code_php",
    CODE_PYTHON: "code_python",
    CODE_R: "code_r",
    CODE_RUBY: "code_ruby",
    CODE_RUST: "code_rust",
    CODE_SYSTEMVERILOG: "code_systemverilog",
    CZECH: "czech",
    DANISH: "danish",
    DUTCH: "dutch",
    ENGLISH: "english",
    ESPERANTO: "esperanto",
    ESTONIAN: "estonian",
    FILIPINO: "filipino",
    FINNISH: "finnish",
    FRENCH: "french",
    GEORGIAN: "georgian",
    GERMAN: "german",
    HEBREW: "hebrew",
    HINDI: "hindi",
    ICELANDIC: "icelandic",
    INDONESIAN: "indonesian",
    IRISH: "irish",
    ITALIAN: "italian",
    KANNADA: "kannada",
    KOREAN: "korean",
    LATIN: "latin",
    LITHUANIAN: "lithuanian",
    MALAGASY: "malagasy",
    MALAYALAM: "malayalam",
    MARATHI: "marathi",
    MONGOLIAN: "mongolian",
    NEPALI: "nepali",
    NORWEGIAN_BOKMAL: "norwegian_bokmal",
    NORWEGIAN_NYNORSK: "norwegian_nynorsk",
    PERSIAN: "persian",
    POLISH: "polish",
    PORTUGUESE: "portuguese",
    ROMANIAN: "romanian",
    RUSSIAN: "russian",
    SANSKRIT: "sanskrit",
    SERBIAN: "serbian",
    SLOVAK: "slovak",
    SPANISH: "spanish",
    SWEDISH: "swedish",
    TAMIL: "tamil",
    THAI: "thai",
    TOKI_PONA: "toki_pona",
    TURKISH: "turkish",
    UKRAINIAN: "ukrainian",
    VIETNAMESE: "vietnamese"
});

const MonkeyModes = Object.freeze({
		TIME: "time",
		WORDS: "words",
		QUOTE: "quote",
		CUSTOM: "custom",
		ZEN: "zen"
});


function getMonkeyMode() {
	const premId = document.getElementById("premidTestMode");
	// time 30 english
	const args = premId.innerHTML.split(" ");
	const mode = Object.keys(MonkeyModes).find(name => MonkeyModes[name] === args[0]);
	const mode2 = args[1];
	let language = Object.keys(MonkeyLanguages).find(name => MonkeyLanguages[name] === args[2]);
	if(language == undefined) {
		const languagesButton = document.querySelector(`#testModesNotice button[commands="languages"]`);
    if(languagesButton !== null && languagesButton !== undefined) {
    	language = languagesButton.innerHTML.replace(`<i class="fas fa-globe-americas"></i>`, "").replaceAll(" ", "_");
    	language = Object.keys(MonkeyLanguages).find(name => MonkeyLanguages[name] === language);
    }
	}
	return {
		"mode": mode,
		"mode2": mode2,
		"language": language
	};
}

function nextQuote() {
	const nextId = getNextQuoteIdForLanguage(getMonkeyMode().language);
	if(nextId == null) return;
	startQuoteWithId(nextId);
}

async function createBqpModal()  {
	try {
		document.getElementById("bqp-modal").outerHTML = "";
	} catch(e) {}
	let startTimestamp = -1;
	let timePlayed = 0.0;
  let wordsTyped = 0;
  let charsTyped = 0;
  let completedQuotes = 0;
  let totalQuotes = 0;
  let completionPercentage = 0;
  let timePlayedString = "?:??";
  let bqplangs = loadBqpLanguages();
  const data = JSON.parse(localStorage.getItem("bqp_data"));
  for(const key in data) {
  	
  	// Check if current key is in selected languages
  	let language = null;
  	// If no language is selected, use default
  	if(bqplangs.length <= 0) bqplangs = [getMonkeyMode().language];
  	for(const current in bqplangs) {
  		if(!key.startsWith(bqplangs[current].toUpperCase())) continue;
  		language = current;
  		break;
  	}
  	if(language == null) continue;
  	
  	totalQuotes++;
  	if(data[key].result == null) continue;
  	completedQuotes++;
  	
  	timePlayed += data[key].result.testDuration;
  	wordsTyped += data[key].words;
  	charsTyped += data[key].length;
	}
	completionPercentage = ((completedQuotes / totalQuotes) * 100).toFixed(2);
	const days = Math.floor(timePlayed / (60 * 60 * 24));
  const hours = Math.floor(timePlayed / (60 * 60)) % 24;
  const minutes = Math.floor(timePlayed / 60) % 60;
  const seconds = Math.floor(timePlayed) % 60;
  timePlayedString = `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`;
	let modal = `
    	<style>
    		#bqp-modal select {
			    width: 100%;
			    margin-bottom: 10px;
			    padding: 8px;
			    font-size: 14px;
			    border-radius: var(--roundness);
    			background: var(--sub-alt-color);
    			color: var(--text-color);
			}
			
			#bqpSelectedLanguages {
			    display: flex;
			    flex-wrap: wrap;
			}
			#bqpRemoveAllButton {
				margin-left: 12px;
				min-width: 150px;
			}
			#bqpAddAllButton {
				margin-left: 12px;
				min-width: 150px;
			}
			
			.language-tag {
			    background: var(--sub-alt-color);
			    border-radius: 4px;
			    padding: 5px 10px;
			    margin: 5px;
			    display: flex;
			    align-items: center;
			}
			
			.language-tag span {
			    margin-right: 10px;
			    font-size: 14px;
			}
			
			.language-tag button {
		        background: none;
			    border: none;
			    cursor: pointer;
			    font-size: 12px;
			    padding: 0;
			}
			.language-tag button:hover {
				color: var(--text-color);
			}

    	</style>
    	<dialog id="bqp-modal" class="modalWrapper" style="opacity: 1;"><div class="modal" style="opacity: 1; background: var(--bg-color);border-radius: var(--roundness);padding: 2rem;display: grid;gap: 1rem;width: 80vw;max-width: 1000px;height: 80vh;grid-template-rows: auto 1fr;">
    		<div>
    			<div style="display: flex; flex-direction: row; justify-content: space-between;align-items:center;"><h2>Quote Progress</h2><h3 id="bqp-close" style="cursor:pointer">&times;</h3></div>
	    		<div style="display: flex; justify-content: center;">
	    			<select id="bqpLanguageSelect">
		            <option value="" disabled selected>Select a language</option>
			            <!-- Options will be added dynamically -->
			        </select>
			        <button id="bqpRemoveAllButton">Remove All</button>
			        <button id="bqpAddAllButton">Add All</button>
	    		</div>
	    		<div id="bqpSelectedLanguages"></div>
    		</div>
            <div>
            	<h3>Progression Stats</h3>
            	<b id="fully-completed" style="display: ${completedQuotes >= totalQuotes ? "block" : "none"};">You've completed all quotes for this filter!</b>
                <p id="completed-quotes">Completed Quotes: ${completedQuotes}/${totalQuotes} (${completionPercentage}%)</p>
                <p id="words-typed">Time typed: ${timePlayedString}</p>
                <p id="words-typed">Words typed: ${wordsTyped.toLocaleString()}</p>
                <p id="words-typed">Chars typed: ${charsTyped.toLocaleString()}</p>
            </div>
            <div><a href="https://github.com/brentspine/monkeytype-quote-queue/" target="_blank">GitHub</a></div>
            <div>Version ${VERSION_ID}</div>
            <button id="modal-next-quote" style="max-width: 20vw">Reload Next Quote</button>
            <button id="reload-data" style="max-width: 20vw;cursor: not-allowed !important;
    pointer-events: all;" disabled>Reload Data</button>
            <button id="save-settings">Save</button>
    	</div></dialog>`;
	document.getElementById("popups").innerHTML += modal;
	document.getElementById("bqp-close").addEventListener("click", function() {
		document.getElementById("bqp-modal").outerHTML = "";
	});
	document.getElementById("reload-data").addEventListener("click", async function() {
		document.getElementById("reload-data").innerHTML = "Reloading...";
		await resetData();
		createBqpModal();
	});
	bqplangs.forEach(lang => addLanguageTagConfig(lang));
	populateLanguageDropdown();
	const languageSelect = document.getElementById("bqpLanguageSelect");
	languageSelect.addEventListener("change", () => {
    const selectedLang = languageSelect.value;
    if (!selectedLang) return;
    
    addLanguageTagConfig(selectedLang);
    saveBqpLanguages(Array.from(document.getElementById("bqpSelectedLanguages").children).filter(tag => tag.id).map(tag => tag.id));
    createBqpModal();
  });
  const addAllButton = document.getElementById("bqpAddAllButton");
  addAllButton.addEventListener("click", () => {
    saveBqpLanguages(Object.values(MonkeyLanguages));
    createBqpModal();
  });
  const removeAllButton = document.getElementById("bqpRemoveAllButton");
  removeAllButton.addEventListener("click", () => {
  	saveBqpLanguages([]);
  	createBqpModal();
  });
  document.getElementById("modal-next-quote").addEventListener("click", function() {
      document.getElementById("bqp-modal").outerHTML = "";
      nextQuote();
  });
	return;
}

function populateLanguageDropdown() {
	const languageSelect = document.getElementById("bqpLanguageSelect");
  const selectedLanguagesDiv = document.getElementById("bqpSelectedLanguages");
  languageSelect.innerHTML = '<option value="" disabled selected>Select a language</option>';
    
  // Get currently selected languages
  const selectedLanguages = Array.from(selectedLanguagesDiv.children).map(tag => tag.id);

  // Add available languages to the dropdown
  for(let lang in MonkeyLanguages) {
  	if (!selectedLanguages.includes(lang)) {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = lang;
        languageSelect.appendChild(option);
    }
  }
}

function addLanguageTagConfig(language) {
  if (document.getElementById(language)) return;
        
	const selectedLanguagesDiv = document.getElementById("bqpSelectedLanguages");
  const tagDiv = document.createElement("div");
  tagDiv.className = "language-tag";
  tagDiv.id = language.replaceAll(" ", "_");

  const span = document.createElement("span");
  span.textContent = language.toLowerCase();
  tagDiv.appendChild(span);

  const button = document.createElement("button");
  button.innerHTML = "&times;";
  button.addEventListener("click", () => {
      tagDiv.remove();
      if(document.getElementById("bqpSelectedLanguages").children.length <= 0) {
      	addLanguageTagConfig(getMonkeyMode().language);
      }
      
      populateLanguageDropdown();
      saveBqpLanguages(Array.from(document.getElementById("bqpSelectedLanguages").children).filter(tag => tag.id).map(tag => tag.id));
      createBqpModal();
  });
  // Remove all <i></i> tags
  document.querySelectorAll("#bqpSelectedLanguages i").forEach(i => i.remove());

  tagDiv.appendChild(button);

  selectedLanguagesDiv.appendChild(tagDiv);
}

document.addEventListener("DOMContentLoaded", async function (event) {
		if(localStorage.getItem("bqp_latest_completion_amount") == undefined)
			localStorage.setItem("bqp_latest_completion_amount", 0);
		
		if(localStorage.getItem("bqp_data") == undefined) {
			await waitForAnyState(MonkeyStates.IDLE);
			await resetData();
			setTimeout(function() {
				nextQuote();
			}, 100);
		} else {
			await waitForAnyState(MonkeyStates.IDLE);
			await refetchResults();
			setTimeout(async function() {
				await waitForAnyState(MonkeyStates.IDLE);
				nextQuote();
			}, 1000);
		}

	    setInterval(function() {
	    	const oldLang = localStorage.getItem("bqp_selected_lang");
	    	const newLang = getMonkeyMode().language;
	    	if(oldLang != newLang) {
		     localStorage.setItem("bqp_selected_lang", newLang);
				 nextQuote();
				}
	    }, 500);
			
		
		
		// Quote ID Notice
		setInterval(function() {
			const quoteId = getMonkeyMode().mode2;
			const quoteIdNotice = document.getElementById("quote-id-notice");
			if(quoteId == undefined || quoteId == null) return;
      if(quoteIdNotice !== null) {
      	quoteIdNotice.innerHTML = `Quote ID: ${quoteId}` + (localStorage.getItem("bqp_completed_lang") == 'true' ? " 🏆" : "");
      	return;
      }
      var newButton = `<button class="textButton" id="quote-id-notice">Quote ID: ${quoteId}</button>`;
      document.getElementById("testModesNotice").innerHTML += newButton;
      document.getElementById("quote-id-notice").addEventListener("click", function() {
         createBqpModal();
      });
		}, 200);
			
		let newButton = document.getElementById("saveScreenshotButton").outerHTML;
    newButton = newButton
        .replaceAll("saveScreenshotButton", "nextQuoteButton")
        .replaceAll(`<i class="far fa-fw fa-image"></i>`, `>>`)
        .replaceAll("Copy screenshot to clipboard", "Jump to next quote in queue");

    document.querySelector("#result .bottom .buttons").innerHTML += newButton;
    document.getElementById("nextQuoteButton").addEventListener("click", function() {
        nextQuote();
    });
			
    setInterval(function() {
    	const monkeyMode = getMonkeyMode();
    	const monkeyState = getMonkeyState();
    	//console.log(monkeyMode);
    	//console.log(monkeyState);
    	// Language:			#premidTestMode
			// Id:						#premidTestMode
			// Acc:						#result .stats .acc .bottom
			// testDuration:	#result .morestats .time .bottom .text (Strip "s")
			// timestamp:			Auto
			// rawWpm:				#result .morestats .raw .bottom
			// wpm:						#result .stats .wpm .bottom
			// _id:						Filled later
    	if(monkeyMode.mode.toUpperCase() == MonkeyModes.QUOTE.toUpperCase() && monkeyState.toUpperCase() == MonkeyStates.RESULT.toUpperCase()) {
    		if(localStorage.getItem("bqp_last_saved") == monkeyMode.mode2) return;
    		localStorage.setItem("bqp_last_saved", monkeyMode.mode2);
    		const acc = parseFloat(document.querySelector("#result .stats .acc .bottom").getAttribute('aria-label').match(/(\d+(\.\d+)?)/)[0]);
    		const testDuration = parseFloat(document.querySelector("#result .morestats .time .bottom").getAttribute('aria-label').match(/(\d+(\.\d+)?)/)[0]);
    		const timestamp = Date.now();
    		const rawWpm = parseFloat(document.querySelector("#result .morestats .raw .bottom").getAttribute('aria-label').match(/(\d+(\.\d+)?)/)[0]);
    		const wpm = parseFloat(document.querySelector("#result .stats .wpm .bottom").getAttribute('aria-label').match(/(\d+(\.\d+)?)/)[0]);
    		saveQuoteResult(monkeyMode.language, monkeyMode.mode2, acc, testDuration, timestamp, rawWpm, wpm);
    		console.log("Saved result " + monkeyMode.mode2);
    	}
    }, 500);
});


function getMonkeyState() {
    const pageLoading = document.getElementById("pageLoading");
    const typingTest = document.getElementById("typingTest");
    const pageAccount = document.getElementById("pageAccount");
    const result = document.getElementById("result");
    const pageLogin = document.getElementById("pageLogin");
    const pageResult = document.getElementById("result");
    
    if(pageLoading !== null && pageLoading !== undefined) return MonkeyStates.LOADING;
    if(pageLogin !== null && pageLogin !== undefined) {
    	const pageLoginOpacity = getStyleOfObjectAsFloat(pageLogin, "opacity");
			if(pageLoginOpacity > 0) return MonkeyStates.LOGIN;
    }
    const pageAccountOpacity = getStyleOfObjectAsFloat(pageAccount, "opacity");
    if(pageAccountOpacity > 0) return MonkeyStates.ACCOUNT;
    if(typingTest === null || typingTest === undefined) return MonkeyStates.ACCOUNT;
    const typingTestOpacity = getStyleOfObjectAsFloat(typingTest, "opacity");
    if(typingTestOpacity > 0) {
    	const hasFocus = document.querySelector('#app main').classList.contains("focus");
    	if(hasFocus) return MonkeyStates.TYPING;
    	return MonkeyStates.IDLE;
    }
    const pageResultOpacity = getStyleOfObjectAsFloat(pageResult, "opacity");
    if(pageResultOpacity > 0) return MonkeyStates.RESULT;
    return MonkeyStates.LOADING;
}

async function waitForAnyState(desiredStates, checkInterval = 100) {
    return new Promise(resolve => {
	const checkState = () => {
	    if (!desiredStates.includes(getMonkeyState())) {
			setTimeout(checkState, checkInterval);
	    } else {
			resolve();
	    }
	};
	checkState();
    });
}

function getStyleOfObjectAsFloat(object, styleType) {
    if (object && object.style) {
        const style = parseFloat(object.style[styleType]);
        if (!isNaN(style)) {
          return style;
        }
    }
    return 0;
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
          // Check localStorage if not found in indexedDB
          let lsAuth = null;
          for (let key in localStorage) {
			        if (localStorage.hasOwnProperty(key) && key.startsWith('firebase:authUser:')) {
			            const authData = JSON.parse(localStorage.getItem(key));
			            if (authData && authData.stsTokenManager && authData.stsTokenManager.accessToken) {
			                lsAuth = authData.stsTokenManager.accessToken;
			                break;
			            }
			        }
			    }
          if (lsAuth) {
            resolve(lsAuth);
          } else {
            alert("Auth token not found in firebaseLocalStorageDb or localStorage. Please reload the page or report an issue if the problem persists. Contact: github.com/brentspine");
            reject('Auth token not found');
          }
        }
      };
    };
  });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resetData() {
    localStorage.setItem("bqp_latest_completion_amount", 0);
    await fetchQuotes();
    // Necessary?
    //await delay(5000);
    await refetchResults();
}

// https://github.com/monkeytypegame/monkeytype/blob/f6a27b2d1886dd79ba26d1e2eae94f0e9401c851/backend/src/dal/result.ts#L95
async function refetchResults() {
	const authToken = await getAuthToken();
	const userResponse = await fetch("https://api.monkeytype.com/users", {
	    headers: {
	    	'Authorization': `Bearer ${authToken}`
			}
	});
	const userData = await userResponse.json();
	const completedTests = userData.data.completedTests;
	const latestCompleted = localStorage.getItem("bqp_latest_completion_amount");
	const completionsMissing = completedTests - latestCompleted;
	localStorage.setItem("bqp_latest_completion_amount", completedTests);
	
	const limit = 1000;
	// W Code
	let page = Math.floor(((completionsMissing-1) / limit))+1;
	while(page > 0) {
		page--;
		// Earliest possible for API
		const response = await fetch("https://api.monkeytype.com/results?limit="+limit+"&offset="+(page*limit), {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
  	});
  	if(response.status > 299) {
  		alert(`Encountered a ${response.status} error code whilst fetching results`);
  	}
  	const data = await response.json();
  	// if(data.data.length <= 0) return;
  	let quotes = data.data.filter(result => result.mode === 'quote');
  	
  	// Put outside of loop?
  	let r = JSON.parse(localStorage.getItem("bqp_data"));
  	for(const q of quotes) {
  		const language = q.language === undefined ? "english" : q.language;
  		try {
  			r[language.toUpperCase()+"_"+q.mode2].result = {
	  			"acc": q.acc,
	  			"testDuration": q.testDuration,
					"timestamp": q.timestamp,
					"rawWpm": q.rawWpm,
					"wpm": q.wpm,
					"_id": q._id
	  		};
  		} catch(e) {
  			console.log(e);
  			console.log(language.toUpperCase()+"_"+q.mode2 + " was not found in data")
  		}
  	}
  	localStorage.setItem("bqp_data", JSON.stringify(r));
  	// if(data.data.length < limit) break;
	}
}

// Language:			#premidTestMode
// Id:						#premidTestMode
// Acc:						#result .stats .acc .bottom
// testDuration:	#result .morestats .time .bottom .text (Strip "s")
// timestamp:			Auto
// rawWpm:				#result .morestats .raw .bottom
// wpm:						#result .stats .wpm .bottom
// _id:						Filled later
function saveQuoteResult(language, id, acc, testDuration, timestamp, rawWpm, wpm, _id=null) {
	let r = JSON.parse(localStorage.getItem("bqp_data"));
	r[language.toUpperCase()+"_"+id].result = {
		"acc": acc,
		"testDuration": testDuration,
		"timestamp": timestamp,
		"rawWpm": rawWpm,
		"wpm": wpm,
		"_id": _id
	};
	localStorage.setItem("bqp_data", JSON.stringify(r));
}

async function fetchQuotes() {
	let r = {};
	
	let promise = new Promise((resolve, reject) => {
			Object.keys(MonkeyLanguages).forEach(async function(lang, index, array) {
				 const response = await fetch("https://monkeytype.com/quotes/"+lang.toString().toLowerCase()+".json");
				 if(response.status > 299) {
		      	// alert(`Encountered a ${response.status} error while fetching quotes for language "${lang}"`);
		      	return;
		      }
				  const data = await response.json();
				  data.quotes.forEach(function(q) {
		      	words = q.text.split(" ").length + 1;
		      	r[lang+"_"+q.id] = {
							"words": words,
							"length": q.length,
							"id": q.id,
							"result": null
						};
		      });
		      if (index === array.length -1) setTimeout(function() {resolve();}, 2500);
			});
	});
	
	promise.then(() => {
    localStorage.setItem("bqp_data", JSON.stringify(r));
	});
	await promise;
}

function getNextQuoteIdForLanguage(language) {
	const data = JSON.parse(localStorage.getItem("bqp_data"));
	for(key in data) {
		if(!key.startsWith(language.toUpperCase())) continue;
		if(data[key].result != null) continue;
		localStorage.setItem("bqp_completed_lang", false);
		return data[key].id;
	}
	localStorage.setItem("bqp_completed_lang", true);
	return null;
}

function startQuoteWithId(quoteId, attempt=1) {
	let quoteElement = document.querySelector(`.searchResult[data-quote-id="${quoteId}"]`);
        
  if (quoteElement === null) {
      console.log(`Quote not loaded, attempt ${attempt}`);
      if(attempt >= 3) {
          console.log(`Couldn't find quote with id ${quoteId} while activating. Next Quote failed after 3 attempts`);
          alert(`Couldn't find quote with id ${quoteId} while activating: Next Quote failed after 3 attempts`);
          return;
      }
      const quote_button = document.querySelector(`#testConfig button[mode="quote"]`);
  	  doClick(quote_button);
      const search_button = document.querySelector(`#testConfig button[quotelength="-2"]`);
      doClick(search_button);
      document.getElementById("searchBox").value = quoteId;
      setTimeout(function() {startQuoteWithId(quoteId, attempt+1)}, attempt*500);
      return;
  }

  doClick(quoteElement);
  console.log(`Triggered click for quote ID: ${quoteId}`);
}

async function saveBqpLanguages(langs) {
	localStorage.setItem("bqp_langs", JSON.stringify(langs));
}

function loadBqpLanguages() {
	try {
		const r = JSON.parse(localStorage.getItem("bqp_langs"));
		if(r == null || r == undefined) return [getMonkeyMode().language];
		if(r.length <= 0) return [getMonkeyMode().language];
		return r;
	} catch(e) {
		return [getMonkeyMode().language];
	}
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
