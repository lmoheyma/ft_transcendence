
function hideFriendsRequests() {
	document.getElementById('friendsRequestDiv').style.display = "none";
	document.getElementById('friendsDiv').style.display = "flex";
}

function displayFriendsRequests() {
	document.getElementById('friendsRequestDiv').style.display = "flex";
	document.getElementById('friendsDiv').style.display = "none";
}

async function rejectFriendInvite() {

}

async function acceptFriendInvite(token, key) {
	try {
        const reponse = await fetch("api/invites?accept=" + token, {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
		// const resultat	= await reponse.json();
        if (reponse.status == 200) {
			console.log()
			// var toDelete = document.getElementById("td" + key);
			// toDelete.remove();
			
        }
        else {
            console.log("Error!");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

function createButtons(tr, item, key) {
	var tdName = document.createElement('td');
	tdName.classList.add('name');
	tdName.id = "td" + key;
	tdName.textContent = item.sender.username;
	var rejectButton = document.createElement('button');
	rejectButton.textContent = "X";
	rejectButton.type = "button";
	rejectButton.classList.add('btn');
	rejectButton.id = "rejectButtonId";
	var acceptButton = document.createElement('button');
	acceptButton.textContent = "Y";
	acceptButton.type = "button";
	acceptButton.classList.add('btn');
	acceptButton.id = "acceptButtonId";
	tr.appendChild(tdName);
	tr.appendChild(rejectButton);
	tr.appendChild(acceptButton);
	// rejectButton.addEventListener('click', rejectFriendInvite());
	// acceptButton.addEventListener('click', acceptFriendInvite(item.code, key));
	acceptButton.onclick = function() {
		acceptFriendInvite(item.code, key) 
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
			var friendsList = document.getElementById("friendsRequestsBody");
			for (const key in resultat) {
				var itemsArray = Array.isArray(resultat[key]) ? resultat[key] : [resultat[key]];
				itemsArray.forEach(item => {
					var tr = document.createElement('tr');
					friendsList.appendChild(tr);
					createButtons(tr, item, key);
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
			var friendsList = document.getElementById("friendsBody");
			if (resultat.length == 0) {
				var paragraph = document.createElement('p');
				paragraph.id = "noFriendsId";
				paragraph.textContent = "No friends :(";
				friendsList.appendChild(paragraph);
				// return ;
			}
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
					removeButton.textContent = "X";
					removeButton.type = "button";
					removeButton.classList.add('btn');
					removeButton.id = "removeButtonId";
					tr.appendChild(tdName);
					tr.appendChild(tdStatus);
					tr.appendChild(removeButton);
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
