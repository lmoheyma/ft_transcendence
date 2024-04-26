
async function login(event) {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const donnees = {username: username, password: password};
	try {
		const reponse = await fetch("/api/token-auth/", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			"Cookie" : document.cookie
			},
			body: JSON.stringify(donnees),
		});
		const resultat	= await reponse.json();
		if (reponse.status == 200)
		{
			var ul = document.getElementById("navbarId");
			var li = document.getElementById("loginId");
			ul.removeChild(li);
			document.getElementById("logoutId").style.display = "block";
			document.cookie = "Session=" + resultat.token;
			session = resultat.token;
			document.getElementById("submit-btn").href="/dashboard";
			route(event);
			console.log("New session token : " + session);
		}
		else if (reponse.status == 400) 
		{
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			Object.keys(resultat).forEach(function(key) {
				var paragraph = document.createElement('p');
				paragraph.textContent = resultat[key][0];
				status.appendChild(paragraph);
				paragraph.style.color = "red";
				console.log(resultat[key][0]);
			});
		}
	} catch (erreur) {
		console.error("Erreur :", erreur);
	}
}

async function logout()
{
	if (getCookie("Session") == "")
		return ;
	console.log("session: " + session);
	const reponse = await fetch("/api/logout", {
		method: "GET",
		headers: {
		"Authorization" : "Token " + getCookie("Session"),
		}
	});
	const resultat	= await reponse.json();
	if (reponse.status == 200)
	{
		console.log("Disconnected token : " + getCookie("Session"));
		document.cookie = "Session=";
		session	= null;
	}
	else
	{
		console.error("Can't disconnect");
	}
}

async function register() {
	const username = document.getElementById('username').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password1').value;
	const password2 = document.getElementById('password2').value;

	const donnees = {username: username, email: email, password1: password, password2: password2};
	try {
		const reponse = await fetch("/api/register/", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			"Cookie" : document.cookie
			},
			body: JSON.stringify(donnees),
		});
		const resultat = await reponse.json();
		if (reponse.status == 201)
		{
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			var paragraph = document.createElement('p');
			paragraph.textContent = "Register!";
			status.appendChild(paragraph);
			paragraph.style.color = "white";
			console.log("Réussite :", resultat);
		}
		else if (reponse.status == 400)
		{
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			Object.keys(resultat).forEach(function(key) {
				var paragraph = document.createElement('p');
				paragraph.textContent = resultat[key][0];
				status.appendChild(paragraph);
				paragraph.style.color = "red";
				console.log(resultat[key][0]);
			});
		}
	} catch (erreur) {
		console.error("Fail!", erreur);
	}
}