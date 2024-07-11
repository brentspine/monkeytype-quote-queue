# Monkeytype Quote Queue

User script to add the "next quote" option. This allows you to type out all quotes after each other. The script actively checks for previous completion.

## Table of contents
**[1. Usage](#usage)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[1.1 Filtering](#usage-filtering)**<br>
**[2. Install](#install)**<br>
**[3. Feature Requests](#feature-requests)**<br>
**[4. Troubleshoot](#troubleshoot)**<br>


## Usage <span id="usage"></span>

Note: You can turn off the extension at any time by using the respective dialog as <a href="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968" target="_blank">seen here</a>

After enabling the extension head to "quotes" and reload the page to be safe. The extension will fetch all your results and all quotes and search for the first non-completed one. It will automatically start the test for that quote. It goes ordered by ID. I can maybe add sorting by length or other things if needed. Just [open an issue](https://github.com/brentspine/monkeytype-quote-queue/issues).

After completing a test, you can use the "Next Quote" button to, as you might have guesses, go to the next queued quote.

![gflkhjndflkgjnhldfkgjnhldkfjgnhldkfgjhn](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/cf8d9f98-95f9-463e-bc93-9fcbd9584c16)

### Filtering <span id="usage-filtering"></span>

You can set a start timestamp for quote completion check. That means that quotes before that timestamp do not count into your completion percentage or general progress. This number is in <b>milliseconds</b>, this is important. You can get the current timestamp in milliseconds [here](https://brentspine.de/tools/live-timestamp/) or [here](https://currentmillis.com/).

<img src="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/6fc396f0-d2ab-4470-accc-3396c5c1e6f9" height=400>


## Install <span id="install"></span>

### Using "User Javascript and CSS" extension

Download [this extension](https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?pli=1) from the Chrome Extension Store.

![image](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/0cb8359e-6061-4574-81ab-2cd91add9ac2)
<i>You might need to restart your browser to apply all changes</i>

You can pin the extension for better use if you want. Click the icon to open up a dialog window. Then click "Create New Rule", a new window will open up.

![ezgif com-animated-gif-maker](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968)

Go to the [latest release](https://github.com/brentspine/monkeytype-quote-queue/releases/tag/release) and copy the contents of the appended JS file. Then paste them into the window you just opened. Press save or use CTRL+S.

<img src="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/489e0063-dd6b-425b-881e-1cea605a986d" height=400>

Close the extension window and reload MonkeyType. The changes should successfully be applied.

<br><i>You might need to reload the page twice due to a init bug. This will only occur once</i>

<i> You can turn off the extension at any time by using the respective dialog as <a href="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968" target="_blank">seen here</a></i>

## Feature Requests <span id="feature-requests"></span>

I love hearing your ideas! Thanks for using this extension. For new feature suggestions, please consider [opening an issue](https://github.com/brentspine/monkeytype-quote-queue/issues) here on GitHub.

You can also reach out to me on Discord (@brentspine) or check out [my Linktree](https://linktr.ee/brentspine) for other ways to connect and discuss your feature suggestions.

## Still have problems or questions? <span id="troubleshoot"></span>

If you still have problems you can open an [issue](https://github.com/brentspine/monkeytype-quote-queue/issues) or [contact me](https://linktr.ee/brentspine).
