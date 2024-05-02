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
		default:
			break;
	}
}

deleteAllActiveClass();
setupNavbar();
changeActivePage();