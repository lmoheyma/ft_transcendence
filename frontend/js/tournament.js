async function join_tournament() {
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
            console.log(resultat);
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

async function create_tournament() {
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
            console.log(resultat);
        }
        else if (reponse.status == 400) {
            console.log(resultat);
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}