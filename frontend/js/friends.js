
function hideFriendsRequests() {
	document.getElementById('friendsRequestDiv').style.display = "none";
	document.getElementById('friendsDiv').style.display = "flex";
}

function displayFriendsRequests() {
	document.getElementById('friendsRequestDiv').style.display = "flex";
	document.getElementById('friendsDiv').style.display = "none";
}

async function deleteFriends(username) {
	const donnees = {id: username};
	try {
        const reponse = await fetch("/api/friends", {
            method: "DELETE",
            headers: {
                "Authorization" : "Token " + getCookie("Session"),
				"Content-Type": "application/json"
            },
			body: JSON.stringify(donnees),
        });
		const resultat	= await reponse.json();
        if (reponse.status == 200) {
			console.log("Success!", resultat, username);
			displayFriendsList();
        }
        else {
			console.log("Error!", resultat.error, username);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function sendFriendRequest() {
	const username = document.getElementById('friendUsername').value;
	const donnees = {id: username};
	try {
        const reponse = await fetch("/api/invites", {
            method: "POST",
            headers: {
                "Authorization" : "Token " + getCookie("Session"),
				"Content-Type": "application/json"
            },
			body: JSON.stringify(donnees),
        });
		const resultat	= await reponse.json();
        if (reponse.status == 200) {
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			var paragraph = document.createElement('p');
			if (resultat.error)
				paragraph.textContent = resultat.error;
			else
				paragraph.textContent = resultat.success;
			status.appendChild(paragraph);
			paragraph.style.color = "white";
        }
        else {
			document.getElementById("status").innerHTML = "";
			var status = document.getElementById("status");
			var paragraph = document.createElement('p');
			if (resultat.error)
			{
				paragraph.textContent = resultat.error;
				paragraph.style.color = "red";
			}
			else
			{
				paragraph.textContent = resultat.success;
				paragraph.style.color = "white";
			}
			status.appendChild(paragraph);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function acceptFriendInvite(token) {
	try {
        const reponse = await fetch("api/invites?accept=" + token, {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat	= await reponse.json();
        if (reponse.status == 200) {
			displayFriendsRequestsList()
        }
        else {
            console.log("Error!");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

function createButtons(tr, item) {
	var tdName = document.createElement('td');
	tdName.classList.add('name');
	tdName.textContent = item.sender.username;
	var acceptButton = document.createElement('button');
	acceptButton.textContent = "Accept";
	acceptButton.type = "button";
	acceptButton.classList.add('btn');
	acceptButton.id = "acceptButtonId";
	tr.appendChild(tdName);
	tr.appendChild(acceptButton);
	acceptButton.onclick = function() {
		acceptFriendInvite(item.code) 
	};
}

async function displayFriendsRequestsList() {
	try {
        const reponse = await fetch("/api/invites", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat	= await reponse.json();
        if (reponse.status == 200) {
			document.getElementById("friendsRequestsBody").innerHTML = "";
			document.getElementById("noFriendsRequests").innerHTML = "";
			if (resultat.length == 0) {
				document.getElementById('friendsRequestsHead').style.display = "none";
				var noFriendsRequests = document.getElementById("noFriendsRequests");
				var paragraph = document.createElement('p');
				paragraph.setAttribute('style', 'white-space: pre;');
				paragraph.textContent = "No\r\nfriends\r\nrequests";
				noFriendsRequests.appendChild(paragraph);
				return ;
			}
			var friendsList = document.getElementById("friendsRequestsBody");
			for (const key in resultat) {
				var itemsArray = Array.isArray(resultat[key]) ? resultat[key] : [resultat[key]];
				itemsArray.forEach(item => {
					var tr = document.createElement('tr');
					friendsList.appendChild(tr);
					createButtons(tr, item);
				});
			}
        }
        else {
            console.log("Error!");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function displayFriendsList() {
	try {
        const reponse = await fetch("/api/friends", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		const resultat	= await reponse.json();
        if (reponse.status == 200) {
            document.getElementById("friendsBody").innerHTML = "";
			document.getElementById("noFriends").innerHTML = "";
			if (resultat.length == 0) {
				document.getElementById('friendsHead').style.display = "none";
				var noFriends = document.getElementById("noFriends");
				var paragraph = document.createElement('p');
				paragraph.setAttribute('style', 'white-space: pre;');
				paragraph.textContent = "No\r\nfriends";
				noFriends.appendChild(paragraph);
				return ;
			}
			var friendsList = document.getElementById("friendsBody");
			for (const key in resultat) {
				var itemsArray = Array.isArray(resultat[key]) ? resultat[key] : [resultat[key]];
				itemsArray.forEach(item => {
					var tr = document.createElement('tr');
					friendsList.appendChild(tr);
					var tdName = document.createElement('td');
					tdName.classList.add('name');
					tdName.textContent = item.username;
					var tdStatus = document.createElement('td');
					tdStatus.classList.add('status');
					tdStatus.textContent = item.status;
					var removeButton = document.createElement('button');
					removeButton.textContent = "x";
					removeButton.type = "button";
					removeButton.classList.add('btn');
					removeButton.id = "removeButtonId";
					tr.appendChild(tdName);
					tr.appendChild(tdStatus);
					tr.appendChild(removeButton);
					removeButton.onclick = function() {
						deleteFriends(item.username)
					};
				});
			}
        }
        else {
            console.log("Error!");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}
