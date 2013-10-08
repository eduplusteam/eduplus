// Saves options to localStorage.
function save_options() {
	localStorage["EDU_saveid"] = document.getElementById("saveidOpt").checked;
	localStorage["EDU_savepass"] = document.getElementById("savepassOpt").checked;
	localStorage["EDU_fillcaptcha"] = document.getElementById("fillcaptchaOpt").checked;

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
	if (typeof localStorage["EDU_saveid"] === "undefined") localStorage["EDU_saveid"] = "true";
	if (typeof localStorage["EDU_savepass"] === "undefined") localStorage["EDU_savepass"] = "false";
	if (typeof localStorage["EDU_fillcaptcha"] === "undefined") localStorage["EDU_fillcaptcha"] = "true";
	document.getElementById("saveidOpt").checked = (localStorage["EDU_saveid"] === "true")?true:false;
	document.getElementById("savepassOpt").checked = (localStorage["EDU_savepass"] === "true")?true:false;
	document.getElementById("fillcaptchaOpt").checked = (localStorage["EDU_fillcaptcha"] === "true")?true:false;
	document.getElementById("saveidOpt").onchange = save_options;
	document.getElementById("savepassOpt").onchange = save_options;
	document.getElementById("fillcaptchaOpt").onchange = save_options;
}
document.addEventListener('DOMContentLoaded', restore_options);