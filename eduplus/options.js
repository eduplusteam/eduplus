// Saves options to localStorage.
function save_options() {
	localStorage["EDU_saveid"] = document.getElementById("saveidOpt").checked;
	localStorage["EDU_savepass"] = document.getElementById("savepassOpt").checked;
	localStorage["EDU_fillcaptcha"] = document.getElementById("fillcaptchaOpt").checked;
	localStorage["EDU_focusonblank"] = document.getElementById("focusonblankOpt").checked;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
    status.style.opacity = 100;
	setTimeout(function() {
    status.style.opacity = 0;
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	if (typeof localStorage["EDU_saveid"] === "undefined") localStorage["EDU_saveid"] = true;
	if (typeof localStorage["EDU_savepass"] === "undefined") localStorage["EDU_savepass"] = false;
	if (typeof localStorage["EDU_fillcaptcha"] === "undefined") localStorage["EDU_fillcaptcha"] = true;
	if (typeof localStorage["EDU_focusonblank"] === "undefined") localStorage["EDU_focusonblank"] = true;
	localStorage["EDU_saveid"] = (localStorage["EDU_saveid"] === "true")?true:false;
	localStorage["EDU_savepass"] = (localStorage["EDU_savepass"] === "true")?true:false;
	localStorage["EDU_fillcaptcha"] = (localStorage["EDU_fillcaptcha"] === "true")?true:false;
	localStorage["EDU_focusonblank"] = (localStorage["EDU_focusonblank"] === "true")?true:false;
	document.getElementById("saveidOpt").checked = (localStorage["EDU_saveid"] === "true")?true:false;
	document.getElementById("savepassOpt").checked = (localStorage["EDU_savepass"] === "true")?true:false;
	document.getElementById("fillcaptchaOpt").checked = (localStorage["EDU_fillcaptcha"] === "true")?true:false;
	document.getElementById("focusonblankOpt").checked = (localStorage["EDU_focusonblank"] === "true")?true:false;
	document.getElementById("saveidOpt").onchange = save_options;
	document.getElementById("savepassOpt").onchange = save_options;
	document.getElementById("fillcaptchaOpt").onchange = save_options;
	document.getElementById("focusonblankOpt").onchange = save_options;

	// Initializing stats if not available
	if (isNaN(localStorage["idFills"])) localStorage["idFills"] = 0;
	if (isNaN(localStorage["passFills"])) localStorage["passFills"] = 0;
	if (isNaN(localStorage["captchaFills"])) localStorage["captchaFills"] = 0;
	if (typeof localStorage["statsSinceDate"] === "undefined") localStorage["statsSinceDate"] = new Date();
	if (new Date(localStorage["statsSinceDate"]) == "Invalid Date") localStorage["statsSinceDate"] = new Date(); // If the variable is corrupted for some reason
	// Showing some stats
	document.getElementById("idFills").innerHTML = localStorage["idFills"];
	document.getElementById("passFills").innerHTML = localStorage["passFills"];
	document.getElementById("captchaFills").innerHTML = localStorage["captchaFills"];
	document.getElementById("statsSinceDate").innerHTML = "(Since "+(new Date(localStorage["statsSinceDate"]).toLocaleDateString())+")";
}
document.addEventListener('DOMContentLoaded', restore_options);