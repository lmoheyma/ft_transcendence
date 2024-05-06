async function join_tournament(event) {
    const code = document.getElementById('code').value;

    try {
        const reponse = await fetch("api/tournament/join?code=" + code, {
            method: "GET",
            headers: {
            "Authorization" : "Token " + getCookie("Session"),
            "Content-Type": "application/json"
            },
        });
        const resultat	= await reponse.json();
        if (reponse.status == 200)
        {
            document.getElementById("join-btn").href="/play-tournament?code=" + resultat["code"];
            route(event);
            console.log(resultat)
        }
        else if (reponse.status == 400) 
        {
            if ("error" in resultat)
            {
                var status = document.getElementById('status');
                status.innerHTML = resultat["error"];
            }
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}

async function create_tournament(event) {
    const code = document.getElementById('code').value;

    try {
        const reponse = await fetch("api/tournament/create", {
            method: "GET",
            headers: {
            "Authorization" : "Token " + getCookie("Session"),
            "Content-Type": "application/json"
            },
        });
        const resultat	= await reponse.json();
        if (reponse.status == 200) {
            document.getElementById("create-btn").href="/play-tournament?code=" + resultat["code"];
            route(event);
            console.log(resultat)
        }
        else if (reponse.status == 400) {
            console.log(resultat);
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}

async function    updateScoreboard(code)
{
    const response = await fetch("/api/tournament/info?code="+code, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization" : "Token " + getCookie("Session"),
        },
    });
    if (await response.status == 200)
    {
        const res = await response.json();

        let scoreboard = document.getElementById('scoreboard');
        const len = scoreboard.rows.length;
        for (let i = len -1; i > 0; i--) {
            scoreboard.deleteRow(i);
        }

        let i = 1;
        res.participants.forEach(e => {
            var new_row     = scoreboard.insertRow();
            var rankCell    = new_row.insertCell();
            var nameCell    = new_row.insertCell();
            var scoreCell   = new_row.insertCell();

            rankCell.innerHTML  = i;
            nameCell.innerHTML  = e.username;
            scoreCell.innerHTML = 0;
            i += 1;
        });
    }
    return response.status;
}

async function loadTournament()
{
    const code = new URLSearchParams(window.location.search).get('code');
    if (code == null)
    {
        alert("No code supplied");
    }
    else
    {
        if (await updateScoreboard(code) == 200)
        {
            alert("Ok");
        }
        else
        {
            alert("Not ok");
        }
    }
}