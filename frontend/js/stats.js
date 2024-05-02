
async function getAccountStats() {
	try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat = await reponse.json();
        if (reponse.status === 200) {
            return [resultat.games_no, resultat.wins, resultat.losses];
        } else {
            console.log("Error", resultat.error);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function displayStats() {
	const statsList = await getAccountStats();
	if (statsList.length != 3) {
		console.log("Error!, Wrong data");
		return ;
	}
	var temp = document.getElementById('gamesPlayed');
	temp.textContent = statsList[0];
	temp = document.getElementById('gamesWons');
	temp.textContent = statsList[1];
	temp = document.getElementById('gamesLoses');
	temp.textContent = statsList[2];
}