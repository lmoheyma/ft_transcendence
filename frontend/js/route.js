
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const loadAndMarkScript = async (scriptPath) => {
    await import(scriptPath);
    switch (scriptPath) {
        case "/js/display_pong.js":
            document.getElementById('pong').src = 'html/pong.html' + window.location.search;
            break;
        case "/js/handle_pong.js":
            if (window.location.pathname === '/pong') {
                const { initHandlePong } = await import('./handle_pong.js');
                initHandlePong();
            }
            break;
        case "/js/pong_multi.js":
            break;
        case "/js/pong_remote.js":
            break;
        case "/js/settings.js":
            setupPlaceholder();
            setupUsername();
            displayAvatar();
            break;
        case "/js/friends.js":
            displayStats();
            hideFriendsRequests();
            displayFriendsList();
            break;
        case "/js/tictactoe.js":
            if (window.location.pathname === '/tictactoe') {
                const { initHandleTTT } = await import('./tictactoe.js');
                initHandleTTT();
            }
            break;
        case "/js/tictactoe_remote.js":
            break;
        case "/js/tournament.js":
            if (window.location.pathname === '/play-tournament')
            {
                const { initTournament } = await import('./tournament.js');
                loadTournament();
            }
            break;
        default:
            break;
    }
};

const loadScriptsSequentially = async (scriptPaths) => {
    for (const scriptPath of scriptPaths) {
        await loadAndMarkScript(scriptPath);
    }
};

const routes = {
    "/": "html/dashboard.html",
    "/dashboard": "html/dashboard.html",
    "/login": "html/login.html",
    "/pong": "html/pong-tab.html",
    "/register": "html/register.html",
    "/settings": "html/settings.html",
    "/tournament": "html/tournament.html",
    "/tictactoe": "html/tic-tac-toe.html",
    "/play-tournament" : "html/play-tournament.html"
};

const handleLocation = async () => {

    var path = window.location.pathname;
    if (getCookie("Session") == "" && path != "/register") {
        path = "/login";
    }
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    if (path === "/pong") {
        await loadScriptsSequentially([
            "/js/display_pong.js"
        ]);
    }
    else if (path === "/settings") {
        await loadScriptsSequentially([
            "/js/settings.js"
        ]);
    }
    else if (path === "/dashboard") {
        await loadScriptsSequentially([
            "/js/friends.js"
        ]);
    }
    else if (path === "/") {
        await loadScriptsSequentially([
            "/js/friends.js"
        ]);
    }
    else if (path === "/tictactoe") {
        await loadScriptsSequentially([
            "/js/tictactoe.js",
            "/js/tictactoe_remote.js"
        ]);
    }
    else if (path === "/tournament")
    {
        await loadScriptsSequentially([
            "/js/tournament.js"
        ]);
    }
    else if (path === "/play-tournament")
    {
        await loadScriptsSequentially([
            "/js/tournament.js"
        ]);
    }
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();