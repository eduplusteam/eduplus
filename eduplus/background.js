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
	if ( (statName != "idFills") && (statName != "passFills") && (statName != "captchaFills") ) return; // Just a security measure - making sure no one is making up bulshit stats
	if (isNaN(localStorage[statName])) localStorage[statName] = 0; // Make sure every stat remains a number
	localStorage[statName]++;
}