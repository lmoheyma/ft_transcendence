

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
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			var paragraph = document.createElement('p');
			paragraph.textContent = "Logged!";
			status.appendChild(paragraph);
			paragraph.style.color = "white";
			session = resultat.token;
			// document.getElementById("submit-btn").addEventListener('click', null);
			document.getElementById("submit-btn").href="/dashboard";
			console.log("href: ", document.getElementById("submit-btn").href);
			route(event);
			// document.getElementById("submit-btn").onclick = function() {
			// 	var link = document.getElementById("submit-btn");
        	// 	link.setAttribute("href", "/dashboard");
			// 	route();
			// }
			// route(event);
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
			console.log("Fail :", resultat);
		}
	} catch (erreur) {
	  console.error("Erreur :", erreur);
	}
}

document.getElementById("monFormulaire").addEventListener("submit", function(event) {
    login(event); // Appel de la fonction login avec l'objet event
});

async function logout()
{
	if (session == null)
		return ;
	const reponse = await fetch("/api/logout", {
		method: "GET",
		headers: {
		"Authorization" : "Token " + session,
		}
	});
	const resultat	= await reponse.json();
	if (reponse.status == 200)
	{
		console.log("Disconnected token : " + session);
		session	= null;
		console.log("New token : " + session);
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
		console.log(reponse.status);
		if (reponse.status == 201)
		{
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			var paragraph = document.createElement('p');
			paragraph.textContent = "Logged!";
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
			console.log("Fail :", resultat);
		}
	} catch (erreur) {
		console.error("Fail!", erreur);
	}
}