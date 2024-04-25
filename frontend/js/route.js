const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/html/404.html",
    "/": "html/home.html",
    "/dashboard": "html/dashboard.html",
    "login": "html/login.html",
    "pong": "html/pong.html",
    "register": "html/register.html",
    "user-info": "html/user-info.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();