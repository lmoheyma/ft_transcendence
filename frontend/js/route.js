var	status_ws = null;

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

async function check_token()
{
	const response = await get_api('/api/check-auth', 'GET');
    if (response.status != 200)
        return false;
	return true;
}


async function loadLanguage(lang) {
    if (!lang)
        return;
    const response = await fetch(`../json/${lang}.json`);
    const translations = await response.json();
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      el.textContent = translations[key] || el.textContent;
    });
  }

class FileView
{
    constructor(scripts, file, auth) {
        this.scripts    = scripts;
        this.file       = file;
        this.auth       = auth;
    }

    async loadScripts() {
        for (const e of this.scripts)
            await import(e);
    }

    async init() {
    }

    async enter() {
        await this.loadScripts();
        await this.init();
    }

    async leave() {
    }
}

class DashboardView extends FileView
{
    constructor() {
        super(["/js/friends.js", "/js/chart.js"], '/html/dashboard.html', true);
    }

    async init() {
        displayPieChart();
        displayStats();
        hideFriendsRequests();
        displayFriendsList();
    }
}

class LoginView extends FileView
{
    constructor() {
        super([], '/html/login.html', false);
    }

    async init()
    {
    }
}

class SettingsView extends FileView
{
    constructor() {
        super(['/js/settings.js'], '/html/settings.html', true);
    }

    async init() {
        setupPlaceholder();
        setupUsername();
        displayAvatar();
    }
}

class PongView extends FileView
{
    constructor() {
        super(['/js/display_pong.js'], '/html/pong-tab.html', true);
    }

    async init() {
        document.getElementById('pong').src = 'html/pong.html' + window.location.search;
        status_ws.send('INGAME');
    }

    async leave() {
        status_ws.send('ONLINE');
    }
}

class TournamentView extends FileView
{
    constructor() {
        super(['/js/tournament.js'], '/html/tournament.html', true);
    }
}

class PlayTournamentView extends FileView
{
    constructor() {
        super(['/js/tournament.js'], '/html/play-tournament.html', true);
    }

    async init() {
        loadTournament();
        status_ws.send('INGAME');
    }

    async leave() {
        status_ws.send('ONLINE');
    }
}

class TicTacToeView extends FileView
{
    constructor() {
        super(["/js/tictactoe.js", '/js/tictactoe_remote.js'], '/html/tic-tac-toe.html', true);
    }

    async init()
    {
        var { initHandleTTT } = await import('/js/tictactoe.js');
        initHandleTTT();
    }
}


class RegisterView extends FileView
{
    constructor() {
        super([], '/html/register.html', false);
    }
}

class Router
{
    constructor() {
        this.routes = {};
        this.current_view = null;
    }

    register(route, view) {
        this.routes[route] = view;
    }

    async handleLocation() {
        var path = window.location.pathname;
        if (this.current_view != null)
            await this.current_view.leave();
        this.current_view = this.routes[path] || this.routes[404];
        if (this.current_view.auth == true && await check_token() === false) {
            this.current_view = this.routes['/login'];
        }
        const html = await fetch(this.current_view.file).then((data) => data.text());
        document.getElementById("main-page").innerHTML = html;
    
        const currentLanguage = '';
        await loadLanguage(currentLanguage);
        this.current_view.enter();
    }

    async route(event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        await this.handleLocation();
    }

    async redirect() {
        window.location.pathname = path;
        await this.handleLocation();
    }
}

var router = new Router();

router.register('/', new DashboardView());
router.register('/dashboard', new DashboardView());
router.register('/login', new LoginView());
router.register('/pong', new PongView());
router.register('/settings', new SettingsView());
router.register('/register', new RegisterView());
router.register('/tournament', new TournamentView());
router.register('/play-tournament', new PlayTournamentView());
router.register('/tictactoe', new TicTacToeView());

function onpopstate_route() { router.handleLocation(); }
if (getCookie('Session') != '')
{
    try
    {
        status_ws = new WebSocket("wss://localhost:8000/ws/status/"+getCookie('Session'));
    } catch
    {
        document.cookie = "Session=";
        session = null;
        router.redirect('/login');
    }
}
window.onpopstate = onpopstate_route;
window.route = router.route;
router.handleLocation();