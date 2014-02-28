chrome.runtime.onInstalled.addListener(function(){
	// Initializing options if not available
	if (typeof localStorage["EDU_saveid"] === "undefined") localStorage["EDU_saveid"] = true;
	if (typeof localStorage["EDU_savepass"] === "undefined") localStorage["EDU_savepass"] = false;
	if (typeof localStorage["EDU_fillcaptcha"] === "undefined") localStorage["EDU_fillcaptcha"] = true;
	if (typeof localStorage["EDU_focusonblank"] === "undefined") localStorage["EDU_focusonblank"] = true;
	// Initializing stats if not available
	if (isNaN(localStorage["idFills"])) localStorage["idFills"] = 0;
	if (isNaN(localStorage["passFills"])) localStorage["passFills"] = 0;
	if (isNaN(localStorage["captchaFills"])) localStorage["captchaFills"] = 0;
	if (typeof localStorage["statsSinceDate"] === "undefined") localStorage["statsSinceDate"] = new Date();
	if (new Date(localStorage["statsSinceDate"]) == "Invalid Date") localStorage["statsSinceDate"] = new Date(); // If the variable is corrupted for some reason
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
    	if (typeof localStorage[request.key] === "undefined"){
			if ( (request.key == 'EDU_saveid') || (request.key == 'EDU_fillcaptcha') || (request.key == 'EDU_focusonblank') ) 
				localStorage[request.key] = true;
			if ( (request.key == 'EDU_savepass') )
				localStorage[request.key] = false;
    	}
    	sendResponse({name: request.key, data: localStorage[request.key]});
		//console.log("sending response for request "+request.key+" with "+localStorage[request.key]);
	}
    else if (request.method == "statPlusPlus")
    	statPlusPlus(request.key);
    else
      sendResponse({}); // snub them.
});

function statPlusPlus(statName){
	if ( (statName != "idFills") && (statName != "passFills") && (statName != "captchaFills") ) return; // Just a security measure - making sure no one is making up bullshit stats
	if (isNaN(localStorage[statName])) localStorage[statName] = 0; // Make sure every stat remains a number
	localStorage[statName]++;
}