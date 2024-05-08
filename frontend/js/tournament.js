var code = null;
var tournament_state = null;
var current_game = null;
var updateInterval = null;
var selfInfo = null;
var ws = null;
const button_classes = ['vignette', 'button', 'btn', 'mx-4'];

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

async function startTournament()
{
    const response   = await get_api("api/tournament/start?code=" + code, "GET");
    
    switch(response.status)
    {
        case 200 :
            let tour_info = document.getElementById('info')
            button_classes.forEach(e => {
                tour_info.classList.remove(e);
            });
            ws.send('START');
            break;
        case 400 :
            const resultat  = await response.json();
            alert('Error : ' + resultat.error);
            break;
        case 401 :
            document.cookie = "Session=";
            session = null;
            redirect('/login');
            break;
        default :
            alert('Error : Try again later.');
    }
}

async function join_tournament(event) {
    const input = document.getElementById('code').value;

    try {
        const reponse   = await get_api("api/tournament/join?code=" + input, "GET");
        const resultat  = await reponse.json();
        switch (reponse.status)
        {
            case 200 :
                document.getElementById("join-btn").href="/play-tournament?code=" + resultat["code"];
                route(event);
                console.log(resultat);
                break;
            case 401 :
                document.cookie = "Session=";
                session = null;
                document.getElementById("logoutId").href="/login";
                route(event);
                break;
            case 400 :
                if ("error" in resultat) 
                {
                    let status = document.getElementById('status');
                    status.innerHTML = resultat["error"];
                }
                break;
            default :  
                let status = document.getElementById('status');
                status.innerHTML = 'Server-side error. Try again later.';
                break ;
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
        switch (reponse.status)
        {
            case 200 :
                document.getElementById("join-btn").href="/play-tournament?code=" + resultat["code"];
                route(event);
                console.log(resultat);
                break;
            case 401 :
                document.cookie = "Session=";
                session = null;
                document.getElementById("logoutId").href="/login";
                route(event);
                break;
            case 400 :
                if ("error" in resultat) 
                {
                    let status = document.getElementById('status');
                    status.innerHTML = resultat["error"];
                }
                break;
            default :  
                let status = document.getElementById('status');
                status.innerHTML = 'Server-side error. Try again later.';
                break ;
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

function    selfDestroy()
{
    if (updateInterval != null)
        clearInterval(updateInterval);
    code = null;
    tournament_state = null;
    current_game = null;
    updateInterval = null;
}

async function  updateTournament()
{
    if (document.location.pathname != '/play-tournament')
    {
        selfDestroy();
        return;
    }
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
        if (tournament_state.is_started === false && tournament_state.ismod == true)
        {
            let tour_info = document.getElementById('info');
            tour_info.innerHTML = 'Start the tournament';
            button_classes.forEach(e => {
                tour_info.classList.add(e);
            });
            tour_info.onclick = startTournament;
        }
        if (tournament_state.games.length > 0 
            && tournament_state.is_started === true 
            && (current_game === null || current_game !== tournament_state.games[0].code))
        {
            current_game = tournament_state.games[0].code;
            let game_iframe = document.getElementById('pong');
            game_iframe.src = '/html/pong.html?mode=remote&code=' + current_game;
            let tour_info   = document.getElementById('info');
            tour_info.innerHTML = tournament_state.games[0].p1 + ' against ' + tournament_state.games[0].p2;
        }
        if (tournament_state.games.length === 0 && tournament_state.is_started === true)
        {
            let game_iframe = document.getElementById('pong');
            game_iframe.src = '';
            game_iframe.width = '0';
            game_iframe.parentNode.classList.remove('w-100')
            let scoreboard_div = document.getElementById('scoreboard-div');
            scoreboard_div.classList.remove('w-25');
            scoreboard_div.classList.add('w-100');
            let info_div = document.getElementById('info');
            if (info_div != null)
                document.getElementById('info').remove();
        }
        if (tournament_state.is_finished == true)
            clearInterval(updateInterval);
        updateScoreboard();
    }
    else
    {
        selfDestroy();
        redirect('/tournament')
    }
    return response.status;
}

async function loadTournament()
{
    code = new URLSearchParams(window.location.search).get('code');
    if (code == null)
        redirect('/tournament');
    else
    {
        if (await updateTournament() == 200)
        {
            updateInterval   = window.setInterval(updateTournament, 10000);
            ws               = new WebSocket(`wss://localhost:8000/ws/tournament/${code}/${getCookie('Session')}`);
            window.onmessage = function(e) {
                if (e.data == 'UPDATE') {
                    updateTournament();
                    ws.send('UPDATE');
                    console.log(e.data);
                }
            };
            ws.onopen = function (event) {
                ws.send('UPDATE');
            };
            ws.onmessage = function (event) {
                if (event.data == 'START' || event.data == 'UPDATE')
                    updateTournament();
            };
        }
    }
}