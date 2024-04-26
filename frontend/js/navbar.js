function setupNavbar() {
	var cookieValue = getCookie("Session");
	if (cookieValue)
		document.getElementById("logoutId").style.display = "block";
}