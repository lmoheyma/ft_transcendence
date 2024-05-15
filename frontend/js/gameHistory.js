
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
    let i = 0;

	historyList.forEach(function(game) {
        if (i++ < 3) {
            const tr = document.createElement('tr');
            const oponent = document.createElement('td');
            oponent.classList.add('oponent');
            oponent.textContent = game['player1_username'] + " vs " + game['player2_username'];
            const score = document.createElement('td');
            score.classList.add('score');
            score.textContent = game['score_player1']
                + " - " + game['score_player2'];
            tr.appendChild(oponent);
            tr.appendChild(score);
            tbody.appendChild(tr);
        }
    });
}

async function modalHistory(historyList) {
	const tbody = document.getElementById('modalTableHistoryBody');
    document.getElementById('modalTableHistoryBody').innerHTML = '';

	historyList.forEach(function(game) {
        const tr = document.createElement('tr');
        const oponent = document.createElement('td');
        oponent.classList.add('oponent');
        oponent.textContent = game['player1_username'] + " vs " + game['player2_username'];
        const score = document.createElement('td');
        score.classList.add('score');
        score.textContent = game['score_player1']
            + " - " + game['score_player2'];
        tr.appendChild(oponent);
        tr.appendChild(score);
        tbody.appendChild(tr);
    });
}

async function eventListenerModal() {
    const historyList = await getAccountHistory();
    document.getElementById('historyModal').addEventListener('shown.bs.modal', function () {
        modalHistory(historyList);
    });
}