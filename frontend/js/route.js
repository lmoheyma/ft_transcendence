const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/home": "frontend/html/home.html",
    "/dashboard": "frontend/html/dashboard.html",
    "/login": "frontend/html/login.html",
    "/pong": "frontend/html/pong.html",
    "/register": "frontend/html/register.html",
    "/user-info": "frontend/html/user-info.html",
};

const loadScripts = async () => {
    const path = window.location.pathname;
    console.log(path);
    switch (path) {
        case "/pong":
            await import("/frontend/js/display_pong.js");
            await import("/frontend/js/handle_pong.js");
            await import("/frontend/js/pong_multi.js");
            await import("/frontend/js/pong_remote.js");
            break;
        default:
            break;
    }
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    await loadScripts();
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();