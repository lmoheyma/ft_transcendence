function hideNavbar() {
	document.getElementById('navbarId').style.display = "none";
}

function displayNavbar() {
	document.getElementById('navbarId').style.display = null;
}

function setupNavbar() {
	var cookieValue = getCookie("Session");
	if (cookieValue) {
		document.getElementById("loginId").style.display = "none";
		document.getElementById("logoutId").style.display = "block";
	}
}

function deleteAllActiveClass() {
	var element;

	element = document.getElementById("dashboardId");
	element.classList.remove("active");
	element = document.getElementById("loginId");
	element.classList.remove("active");
	element = document.getElementById("logoutId");
	element.classList.remove("active");
	element = document.getElementById("pongMultiId");
	element.classList.remove("active");
	element = document.getElementById("pongRemoteId");
	element.classList.remove("active");
	element = document.getElementById("pongAiId");
	element.classList.remove("active");
	element = document.getElementById("tournamentId");
	element.classList.remove("active");
	element = document.getElementById("en-language");
	element.classList.remove("active");
	element = document.getElementById("fr-language");
	element.classList.remove("active");
	element = document.getElementById("pt-language");
	element.classList.remove("active");
}

function loginActivePage() {
	var element = document.getElementById("dashboardId");
	element.classList.add("active");
}

function changeActivePage() {
	var path = window.location.pathname;
	var element;

	deleteAllActiveClass();

	const queryString = window.location.search;
	const choices = ['remote', 'multi', 'ai']
	const mode = new URLSearchParams(queryString).get('mode');
	var thisGamemod = thisGamemod = mode != null && choices.includes(mode) ? mode : '';
	const tmp_path = thisGamemod ? `${path}?mode=${thisGamemod}` : path;

	switch (tmp_path) {
		case "/dashboard":
			element = document.getElementById("dashboardId");
			element.classList.add("active");
			break ;
		case "/login":
			element = document.getElementById("loginId");
			element.classList.add("active");
			break ;
		case "/logout":
			element = document.getElementById("logoutId");
			element.classList.add("active");
			break ;
		case "/pong":
			element = document.getElementById("pongMultiId");
			element.classList.add("active");
			console.log(element.classList)
			break ;
		case "/pong?mode=remote":
			element = document.getElementById("pongRemoteId");
			element.classList.add("active");
			break ;
		case "/pong?mode=ai":
			element = document.getElementById("pongAiId");
			element.classList.add("active");
			break ;
		case "/tournament":
			element = document.getElementById("tournamentId");
			element.classList.add("active");
			break ;
		default:
			break;
	}

	switch (currentLanguage) {
		case "en":
			element = document.getElementById("en-language");
			element.classList.add("active");
			break ;
		case "fr":
			element = document.getElementById("fr-language");
			element.classList.add("active");
			break ;
		case "pt":
			element = document.getElementById("pt-language");
			element.classList.add("active");
			break ;
		default:
			break;
	}
}

window.addEventListener('message', (e) => {
	switch (e.data)
	{
		case 'HIDENAV' :
			hideNavbar();
			break;
		case 'SHOWNAV' :
			displayNavbar();
			break;
	}
});

deleteAllActiveClass();
setupNavbar();
changeActivePage();