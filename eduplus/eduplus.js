doYourThings();

function doYourThings(){	
	// Check to see if we are on the Login page
	pageforms = document.getElementsByTagName('form');
	for (i=0; i<pageforms.length; i++)
		if (pageforms[i].method == "post" && pageforms[i].action == "https://edu.sharif.edu/login.do" && pageforms[i].name == "mainform" ) loginFormTag = pageforms[i];
	if (typeof loginFormTag === "undefined") {
		setTimeOut(doYourThings, 1000);
		return;
	}
	showEDUPlusNotice();
	if (shouldSaveID()) restoreID();
	if (shouldSavePass()) restorePass();
	if (shouldFillCaptcha()) sortOutCaptcha();
}


function showEDUPlusNotice(){
	var badyTag = document.getElementsByTagName('body')[0];
	var notice = document.createElement("div");
	notice.innerHTML = 'This page has been enhanced by <a href="'+chrome.extension.getURL("options.html")+'">EDU+</a>';
	notice.style.cssText = "width:365px; text-align:center; font-size: 0.8em; color: black; border-radius:5px; border: 1px solid transparent; border-color: #F0C36D; background-color: #F9EDBE; padding:1px; margin:1px auto; ";
	badyTag.insertBefore(notice, badyTag.firstChild);
}
function restoreID(){
	pageinputs = document.getElementsByTagName('input');
	for (i=0; i<pageinputs.length; i++)
		if (pageinputs[i].name == "username") IDInputTag = pageinputs[i];
	if (typeof IDInputTag === "undefined") {
		//alert('Could not locate ID input!');
		setTimeOut(restoreID, 1000);
	}
	else {		
		IDInputTag.value = localStorage["EDU_latestid"];
		IDInputTag.onchange = function(){localStorage["EDU_latestid"] = this.value;};
	}	
}

function restorePass(){
	pageinputs = document.getElementsByTagName('input');
	for (i=0; i<pageinputs.length; i++)
		if (pageinputs[i].name == "password") PassInputTag = pageinputs[i];
	if (typeof PassInputTag === "undefined") {
		//alert('Could not locate Pass input!');
		setTimeOut(restorePass, 1000);
	}
	else {		
		PassInputTag.value = localStorage["EDU_latestpass"];
		PassInputTag.onchange = function(){localStorage["EDU_latestpass"] = this.value;};
	}	
}

function sortOutCaptcha(){
	imgs = document.getElementsByTagName('img');
	for (i=0; i<imgs.length; i++)
		if (imgs[i].src == "https://edu.sharif.edu/jcaptcha.jpg") captchaImageTag = imgs[i];
	if (typeof captchaImageTag === "undefined"){
		//alert('Could not locate Captcha!');
		setTimeOut(sortOutCaptcha, 1000);
	}
	else {
		captchaImageTag.onload = fillInCaptcha;
		if (captchaImageTag.complete) fillInCaptcha();		
	}
}

function fillInCaptcha(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	ctx.drawImage(captchaImageTag, 0, 0);
	
	var captchaGuess = "";
	var guessConfidence = 1;
	var x=0, y=0;
	var width = 14; //captchaImageTag.width
	var height = 24; //captchaImageTag.height;
	var numOfDigits = 4;
	digits = new Array(numOfDigits);
	dists = new Array(numOfDigits);
	for (digitIndex = 0; digitIndex<numOfDigits; digitIndex++){
		digits[digitIndex] = {pixels: new Array(width)};
		dists = new Array(0,0,0,0,0,0,0,0,0,0);
		for (var x=0; x<width; x++)
			digits[digitIndex].pixels[x] = new Array(height);
			
		var X0 = 2 + digitIndex * width;
		var Y0 = 0;
		var imageData = ctx.getImageData(X0, Y0, width, height);
		for (var x=0; x<width; x++)
			for (var y=0; y<height; y++){
				i = (y*width+x)*4;
				var r = imageData.data[i + 0];
				var g = imageData.data[i + 1];
				var b = imageData.data[i + 2];
				var a = imageData.data[i + 3];
				a = 0;
				if (r<200 || g<200 || b<200) a = 1;
				digits[digitIndex].pixels[x][y] = a;
				for (var dig=0; dig<10; dig++)
					dists[dig] += (truePattern(dig)[x][y] != a)?1:0;
			}
		var sorteddists = dists.slice(0);
		sorteddists.sort(function (a, b) {return a - b;});
		captchaGuess += new String(dists.indexOf(sorteddists[0]));
		guessConfidence -= (sorteddists[0]/256)/4;
		
		/*
		var digitCanvas = document.createElement("canvas");
		digitCanvas.width = width;
		digitCanvas.height = height;
		var digitCanvasCtx = digitCanvas.getContext("2d");
		digitCanvasCtx.moveTo(0.5, 0.5); 
		digitCanvasCtx.lineTo(0.5, height - 0.5);
		digitCanvasCtx.lineTo(width - 0.5, height - 0.5);
		digitCanvasCtx.lineTo(width - 0.5, 0.5);
		digitCanvasCtx.lineTo(0.5, 0.5);
		for (var x=0; x<width; x++)
			for (var y=0; y<height; y++)
				if (digits[digitIndex].pixels[x][y])
					digitCanvasCtx.fillRect(x+0.5, y+0.5, 1, 1);				
		digitCanvasCtx.strokeStyle = "#000";
		digitCanvasCtx.stroke();
		document.getElementsByTagName('body')[0].appendChild(digitCanvas); // Just for testing purposes
		*/
	}
	//document.getElementsByTagName('body')[0].appendChild(document.createElement("br")); // Just for testing purposes
	//document.getElementsByTagName('body')[0].appendChild(canvas); // Just for testing purposes
	//var json = JSON.stringify(digits);
	
	var captchaInput = document.getElementById('captcha');
	captchaInput.value = captchaGuess;
	captchaInput.style.border = "1px solid rgb("+Math.round((1-guessConfidence)*256)+", "+Math.round(guessConfidence*256)+", 0)";
	//document.getElementsByTagName('body')[0].insertBefore(document.createTextNode(''+guessConfidence), document.getElementsByTagName('body')[0].firstChild);
}

function truePattern(digit){
	switch (digit){
		case 0: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 1: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 2: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0]];
		case 3: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 4: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 5: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 6: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 7: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 8: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		case 9: return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
	}
}
function shouldSaveID(){	
	chrome.extension.sendMessage({method: "getLocalStorage", key: "EDU_saveid"}, function(response) {
		if (typeof response === "undefined" || typeof response.data === "undefined")
			localStorage["EDU_saveid"] = "false";
		else
			localStorage["EDU_saveid"] = response.data;	});
	if ( (localStorage["EDU_saveid"] === "false") || (typeof localStorage["EDU_latestid"] === "undefined") ) localStorage["EDU_latestid"] = "";
	return (localStorage["EDU_saveid"] === "true")?true:false;
}
function shouldSavePass(){
	chrome.extension.sendMessage({method: "getLocalStorage", key: "EDU_savepass"}, function(response) {
		if (typeof response === "undefined" || typeof response.data === "undefined")
			localStorage["EDU_savepass"] = "false";
		else
			localStorage["EDU_savepass"] = response.data;
	});
	if ( (localStorage["EDU_savepass"] === "false") || (typeof localStorage["EDU_latestpass"] === "undefined") ) localStorage["EDU_latestpass"] = "";
	return (localStorage["EDU_savepass"] === "true")?true:false;
}
function shouldFillCaptcha(){
	chrome.extension.sendMessage({method: "getLocalStorage", key: "EDU_fillcaptcha"}, function(response) {
		if (typeof response === "undefined" || typeof response.data === "undefined")
			localStorage["EDU_fillcaptcha"] = "false";
		else
			localStorage["EDU_fillcaptcha"] = response.data;
	});
	return (localStorage["EDU_fillcaptcha"] === "true")?true:false;
}