var code = null;
var tournament_state = null;
var current_game = null;

async function get_api(endpoint, method)
{
    const reponse = await fetch(endpoint, {
        method: method,
        headers: {
        "Authorization" : "Token " + getCookie("Session"),
        "Content-Type": "application/json"
        },
    });
    return await reponse;
}

async function join_tournament(event) {
    const code = document.getElementById('code').value;

    try {
        const reponse = await get_api("api/tournament/join?code=" + code, "GET");
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
        const reponse = await get_api("api/tournament/create", "GET");
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

function  updateScoreboard()
{
    let scoreboard = document.getElementById('scoreboard');

    const len = scoreboard.rows.length;
    for (let i = len - 1; i > 0; i--) {
        scoreboard.deleteRow(i);
    }
    let i = 1;
    tournament_state.participants.forEach(e => {
        let new_row     = scoreboard.insertRow();
        let rankCell    = new_row.insertCell();
        let nameCell    = new_row.insertCell();
        let scoreCell   = new_row.insertCell();

        rankCell.innerHTML  = i;
        nameCell.innerHTML  = e.username;
        scoreCell.innerHTML = 0;
        i += 1;
    });
}

async function  updateTournament()
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
        tournament_state = await response.json();

        console.log(tournament_state.games.length);
        if (tournament_state.games.length > 0 
            && tournament_state.is_started == true 
            && (current_game === null || current_game !== tournament_state.games[0].code))
        {
            current_game = tournament_state.games[0].code;
            let game_iframe = document.getElementById('pong');
            game_iframe.src = '/html/pong.html?mode=remote&code=' + current_game;
            let tour_info   = document.getElementById('info');
            tour_info.innerHTML = tournament_state.games[0].p1 + ' against ' + tournament_state.games[0].p2;
        }
        else
        {

        }
        updateScoreboard();
    }
    return response.status;
}

async function loadTournament()
{
    code = new URLSearchParams(window.location.search).get('code');
    if (code == null)
    {
        alert("No code supplied");
    }
    else
    {
        if (await updateTournament() == 200)
        {
            updateInterval  = window.setInterval(updateTournament, 1000);
        }
        else
        {
            alert("Not ok");
        }
    }
}