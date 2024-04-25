
const loadAndMarkScript = async (scriptPath) => {
    await import(scriptPath);
    switch (scriptPath) {
        case "/js/display_pong.js":
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
            if (window.location.pathname === '/pong') {
                const { initRemote } = await import('./pong_remote.js');
                initRemote()
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
    "/": "html/home.html",
    "/home": "html/home.html",
    "/dashboard": "html/dashboard.html",
    "/login": "html/login.html",
    "/pong": "html/pong.html",
    "/register": "html/register.html",
    "/user-info": "html/user-info.html",
};

const handleLocation = async () => {
    var path = window.location.pathname;
    console.log("Path: ", path);
    if (session == null && path != "/register") {
        path = "/login";
    }
    const route = routes[path] || routes[404];
    const response = await fetch(route, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'ETag': 'unique_identifier',
            'Last-Modified': 'date'
        }
    });
    const html = await response.text();
    document.getElementById("main-page").innerHTML = html;

    if (path === "/pong") {
        await loadScriptsSequentially([
            "/js/display_pong.js",
            "/js/handle_pong.js",
            "/js/pong_multi.js",
            "/js/pong_remote.js"
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