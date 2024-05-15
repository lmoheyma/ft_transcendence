
function clearInput() {
    document.getElementById('password').value = '';
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('new_password').value = '';
}

async function editProfile() {
    const donnees = {};
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const new_password = document.getElementById('new_password').value;
    console.log("Password: %s Username: %s Email: %s New_password: %s", password, username, email, new_password);
    if (password != "")
        donnees.password = password;
    if (username != "")
    {
        console.log("ERGERGRE", username);
        donnees.username = username;
    }
    if (email != "")
        donnees.email = email;
    if (new_password != "")
        donnees.new_password = new_password;
    console.log(donnees);
    try {
        const reponse = await fetch("/api/account/update", {
            method: "UPDATE",
            headers: {
                "Authorization" : "Token " + getCookie("Session"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(donnees)
        });
        const resultat = await reponse.json();
        if (reponse.status === 200) {
            document.getElementById("status").innerText = "";
            setupUsername();
            setupPlaceholder();
            clearInput();
        } else {
            document.getElementById("status").innerText = "";
			var status = document.getElementById("status");
			Object.keys(resultat).forEach(function(key) {
				var paragraph = document.createElement('p');
				paragraph.textContent = resultat[key];
				status.appendChild(paragraph);
				paragraph.style.color = "red";
				console.log(resultat[key]);
			});
            console.log("Error!", resultat);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function setupPlaceholder() {
    try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
        const resultat = await reponse.json();
        if (reponse.status === 200) {
            document.getElementById('password').placeholder = "********";
            document.getElementById('username').placeholder = resultat.username;
            document.getElementById('email').placeholder = resultat.email;
            document.getElementById('new_password').placeholder = "********";
        } else {
            console.log("Error!", resultat);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

async function setupUsername() {
    try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
        const resultat = await reponse.json();
        if (reponse.status === 200) {
            var div = document.getElementById('usernameId');
            div.textContent = resultat.username;
        } else {
            console.log("Error!", resultat);
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}

function getFileName(myfile) {
    var file = myfile.files[0];  
    var filename = file.name;
    const div = document.getElementById('filenameId');
    div.textContent = filename;
}

async function displayAvatar() {
    var img = document.getElementById("avatarImg");
    if (img)
        img.parentNode.removeChild(img);
    try {
        var pathAvatar = await getAvatarPath();
        var div = document.getElementById("avatar");
        var img = document.createElement('img');
        if (!pathAvatar)
            pathAvatar = "/img/default.png"; // Must change it, it has to be setup at account creation
        img.src = pathAvatar;
        img.alt = "Avatar";
        img.id = "avatarImg";
        div.appendChild(img);
    } catch (erreur) {
        console.error("Error: ", erreur);
    }
}

async function getAvatarPath() {
    try {
        const reponse = await fetch("/api/account", {
            method: "GET",
            headers: {
                "Authorization" : "Token " + getCookie("Session")
            },
        });
        if (reponse.status === 200) {
            const resultat = await reponse.json();
            return resultat.avatar;
        } else {
            throw new Error("Error");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
        throw erreur;
    }
}

function handleSubmit(event) {
    event.preventDefault();

    avatarUpload();
}

async function avatarUpload() {
    var form = document.getElementById('fileToUpload');
    document.getElementById('filenameId').innerText = "";
    console.log()
    try {
        const reponse = await fetch("/api/account/avatar_upload", {
            method: "PUT",
            headers: {
                "Authorization" : "Token " + getCookie("Session"),
                "Content-Disposition" : "attachement; filename=upload.jpg"
            },
            body: form.files[0]
        });
        if (reponse.status == 204) {
            displayAvatar();
        }
        else {
            console.log("Error!");
        }
    } catch (erreur) {
        console.error("Fail!", erreur);
    }
}