
async function getAccountHistory() {
	try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat = await reponse.json();
        if (reponse.status === 200) {
            return resultat.history;
        } else {
            console.log("Error", resultat.error);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function displayHistory() {
	const historyList = await getAccountHistory();
	const tbody = document.getElementById('historyBody');

	historyList.forEach(function(game) {
        const tr = document.createElement('tr');
        const oponent = document.createElement('td');
        oponent.classList.add('oponent');
        oponent.textContent = "vs " + game['player1'];
        const score = document.createElement('td');
        score.classList.add('score');
        score.textContent = game['score_player1']
            + " - " + game['score_player2'];
        tr.appendChild(oponent);
        tr.appendChild(score);
        tbody.appendChild(tr);
    });
}