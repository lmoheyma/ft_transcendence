
async function displayAvatar() {
    var img = document.getElementById("avatarImg");
    if (img)
        img.parentNode.removeChild(img);
    try {
        var pathAvatar = await getAvatarPath();
        var div = document.getElementById("avatar");
        var img = document.createElement('img');
        console.log(pathAvatar);
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
    console.log(form.files[0]);

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