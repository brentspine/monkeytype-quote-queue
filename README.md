# Monkeytype Quote Queue

### Video Tutorial

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/Pkry5tfjUiU0/0.jpg)](https://www.youtube.com/watch?v=Pkry5tfjUiU)

User script to add the "next quote" option. This allows you to type out all quotes after each other. The script actively checks for previous completion.

## Table of contents
**[1. Usage](#usage)**<br>
**[2. Config and Stats](#config-stats)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[2.1 Stats](#stats)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[2.2 Filtering](#usage-filtering)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[2.3 Language Options](#language-options)**<br>
**[3. Install](#install)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[3.1 Automatic Updates](#install-updates)**<br>
**&nbsp;&nbsp;&nbsp;&nbsp;[3.2 Static](#install-static)**<br>
**[4. Feature Requests](#feature-requests)**<br>
**[5. Troubleshoot](#troubleshoot)**<br>


## Usage <span id="usage"></span>

Note: You can turn off the extension at any time by using the respective dialog as <a href="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968" target="_blank">seen here</a>

After enabling the extension head to the "quotes" typing test. The extension will fetch all your results and all quotes and search for the first non-completed one. It will automatically start the test for that quote. It goes ordered by ID. I can maybe add sorting by length or other things if needed. Just [open an issue](https://github.com/brentspine/monkeytype-quote-queue/issues).

After completing a test, you can use the "Next Quote" button to, as you might have guessed, go to the next queued quote.

![gflkhjndflkgjnhldfkgjnhldkfjgnhldkfgjhn](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/cf8d9f98-95f9-463e-bc93-9fcbd9584c16)
<i>Read about settings/config and stats below</i>

## Config and Stats <span id="config-stats"></span>

You can access the config by pressing the current Quote display at the top of the typing test. 

<img src="https://github.com/user-attachments/assets/92c8d00c-75b9-4211-ac5e-78052efb2023" height=190><br>
<i>The current quote id is only displayed in quote mode</i>


### Stats <span id="stats"></span>

I have currently implemented the following 4 stat counters: 
 1. Completed Quotes: amount / total (percentage%)
 2. Time Typed: Days, hours, minutes (+seconds if days<1)
 3. Words Typed
 4. Chars Typed

### Filtering <span id="usage-filtering"></span>

You can set a start timestamp for quote completion check. That means that quotes before that timestamp do not count into your completion percentage or general progress. This number is in <b>milliseconds</b>, this is important. You can get the current timestamp in milliseconds [here](https://brentspine.de/tools/live-timestamp/) or [here](https://currentmillis.com/).

<img src="https://github.com/user-attachments/assets/04730835-c9dd-4ab6-995f-1ce41c02eaaf" height=400>


### Language options <span id="language-options"></span>

The script can now differenciate between quote languages. Just select a language using the globe icon at the top of the typing test and the tracking will automatically update.

## Install <span id="install"></span>

Download [this extension](https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?pli=1) from the Chrome Extension Store.

![image](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/0cb8359e-6061-4574-81ab-2cd91add9ac2)
<i>You might need to restart your browser to apply all changes</i>

You can pin the extension for better use if you want. Click the icon to open up a dialog window. Then click "Create New Rule", a new window will open up.

![ezgif com-animated-gif-maker](https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968)

<b>You can either use automatic updating or just copy the latest script, both options are described below</b> <a href="#install-updates">Automatic Updates</a> or <a href="#install-static">Static</a>

### Automatic Updates <span id="install-updates"></span>

1. Go to this URL: https://brentspine.github.io/monkeytype-quote-queue/
2. Select your version, we will use "latest" for automatic updates
3. Click "Generate"
4. Copy the contents by pressing "Copy"
5. Then paste them into the window you just opened. Press save or use CTRL+S.

<img src="https://github.com/user-attachments/assets/db4fab80-2160-4e83-9077-9377d9a9a123" height=250>

Close the extension window and reload MonkeyType. The changes should successfully be applied.

<br><i>You might need to reload the page twice due to a init bug. This will only occur once</i>

<i> You can turn off the extension at any time by using the respective dialog as <a href="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968" target="_blank">seen here</a></i>

### Static <span id="install-static"></span>

Go to the [latest release](https://github.com/brentspine/monkeytype-quote-queue/releases/) and copy the contents of the appended JS file. Then paste them into the window you just opened. Press save or use CTRL+S.

<img src="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/489e0063-dd6b-425b-881e-1cea605a986d" height=250>

Close the extension window and reload MonkeyType. The changes should successfully be applied.

<br><i>You might need to reload the page twice due to a init bug. This will only occur once</i>

<i> You can turn off the extension at any time by using the respective dialog as <a href="https://github.com/brentspine/monkeytype-quote-queue/assets/55391576/98ecee87-cf95-4a96-93fd-50db753cb968" target="_blank">seen here</a></i>

## Feature Requests <span id="feature-requests"></span>

I love hearing your ideas! Thanks for using this extension. For new feature suggestions, please consider [opening an issue](https://github.com/brentspine/monkeytype-quote-queue/issues) here on GitHub.

You can also reach out to me on Discord (@brentspine) or check out [my Linktree](https://linktr.ee/brentspine) for other ways to connect and discuss your feature suggestions.

## Still have problems or questions? <span id="troubleshoot"></span>

If you still have problems you can open an [issue](https://github.com/brentspine/monkeytype-quote-queue/issues) or [contact me](https://linktr.ee/brentspine).
