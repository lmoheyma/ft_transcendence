function hideNavbar() {
	document.getElementById('navbarId').style.display = "none";
}

function displayNavbar() {
	document.getElementById('navbarId').style.display = "block";
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
}

function loginActivePage() {
	var element = document.getElementById("dashboardId");
	element.classList.add("active");
}

function changeActivePage() {
	var path = window.location.pathname;
	var element;

	deleteAllActiveClass();
	switch (path) {
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
		case "/pong?mode=multi":
			element = document.getElementById("pongMultiId");
			element.classList.add("active");
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