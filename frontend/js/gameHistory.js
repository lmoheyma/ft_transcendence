
async function getAccountHistory() {
	try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat = await reponse.json();
        if (reponse.status === 200) {
            return resultat.hitory;
        } else {
            console.log("Error", resultat.error);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function displayHistory() {
	const historyList = await getAccountHistory();
	
	for(let i = 0; i < historyList.length; i++) {
		console.log(i);
	}
}