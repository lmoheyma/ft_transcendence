async function getSpecificStats() {
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

async function displaySpecificStats(gamesPlayed) {
    const statsList = await getSpecificStats();
    var nbBouncesTotal = 0;
    var playingTime = 0.0;

    var div = document.getElementById('div-0');
    const nbBounces = document.createElement('h1');
    nbBounces.id = 'stats-h1';
    statsList.forEach(function(game) {
        nbBouncesTotal += parseInt(game['nb_bounces']);
        playingTime += parseFloat(game['game_duration']);
    });
    nbBounces.textContent = gamesPlayed > 0 ? nbBouncesTotal / gamesPlayed : 0;
    div.appendChild(nbBounces);

    div = document.getElementById('div-1');
    var averageGameTime = document.createElement('h1');
    averageGameTime.id = 'stats-h1';
    averageGameTime.textContent = gamesPlayed > 0 ? playingTime.toFixed(1) / gamesPlayed : 0;
    div.appendChild(averageGameTime);

    div = document.getElementById('div-3');
    var playingTimeDiv = document.createElement('h1');
    playingTimeDiv.id = 'stats-h1';
    playingTimeDiv.textContent = playingTime;
    div.appendChild(playingTimeDiv);
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
    // console.log("here");
    displaySpecificStats(statsList[0]);
}