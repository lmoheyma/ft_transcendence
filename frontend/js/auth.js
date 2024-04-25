
async function login() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const donnees = {username: username, password: password};
	console.log(donnees);
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
			session			= resultat.token;
			console.log("New session token : " + session);
		}
		else
		{
			console.error(resultat);
		}
	} catch (erreur) {
	  console.error("Erreur :", erreur);
	}
}

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
	console.log(donnees);
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
	  console.log("Réussite :", resultat);
	//   route();
	} catch (erreur) {
	  console.error("Erreur :", erreur);
	}
}