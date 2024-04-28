function hideNavbar() {	
	console.log("here");
	document.getElementById('navbarId').style.display = "none";
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

	element = document.getElementById("homeId");
	element.classList.remove("active");
	element = document.getElementById("dashboardId");
	element.classList.remove("active");
	element = document.getElementById("loginId");
	element.classList.remove("active");
	element = document.getElementById("logoutId");
	element.classList.remove("active");
	element = document.getElementById("pongId");
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
		case "/home":
			element = document.getElementById("homeId");
			element.classList.add("active");
			break;
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
		// case "/pong":
		// 	element = document.getElementById("pongId");
		// 	element.classList.add("active");
		// 	break ;
		default:
			break;
	}
}

deleteAllActiveClass();
setupNavbar();
changeActivePage();