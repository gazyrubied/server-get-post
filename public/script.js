const getSoccerPlayers = async () => {
    try {
        return (await fetch("/api/soccerPlayers")).json();
    } catch (error) {
        console.log(error);
    }
};

const showSoccerPlayers = async () => {
    let soccerPlayers = await getSoccerPlayers();
    let soccerPlayersDiv = document.getElementById("player-list");
    soccerPlayersDiv.innerHTML = "";
    soccerPlayers.forEach((player) => {
        const section = document.createElement("section");
        section.classList.add("player");
        soccerPlayersDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = player.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(player);
        };
    });
};

const displayDetails = (player) => {
    const playerDetails = document.getElementById("player-details");
    playerDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = player.name;
    playerDetails.append(h3);

    const img = document.createElement("img");
    img.src = player.img;  
    img.alt = player.name;  
    img.classList.add("player-image");
    playerDetails.append(img);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    playerDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    playerDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    playerDetails.append(p);
    p.innerHTML = `Team: ${player.team}, Position: ${player.position}, Nationality: ${player.nationality}, Goals Scored: ${player.goalsScored}, Assists: ${player.assists}`;

    const ul = document.createElement("ul");
    playerDetails.append(ul);
    console.log(player.achievements);
    player.achievements.forEach((achievement) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = achievement;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Player";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
    };

    populateEditForm(player);
};

const populateEditForm = (player) => {

    document.getElementById("name").value = player.name;
    document.getElementById("team").value = player.team;
    document.getElementById("position").value = player.position;
    document.getElementById("nationality").value = player.nationality;
    document.getElementById("goalsScored").value = player.goalsScored;
    document.getElementById("assists").value = player.assists;

    const achievementBoxes = document.getElementById("achievement-boxes");
    achievementBoxes.innerHTML = "";
    player.achievements.forEach((achievement) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = achievement;
        achievementBoxes.appendChild(input);
    });
};
const addEditPlayer = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-player-form");
    const formData = new FormData(form);
    let response;

    if (form._id.value == -1) {
        formData.delete("_id");
        formData.delete("img");
        formData.append("achievements", getAchievements());

        response = await fetch("/api/soccerPlayers", {
            method: "POST",
            body: formData,
        });
    }

    if (response.status != 200) {
        console.log("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showSoccerPlayers();

    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";


    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
};


const getAchievements = () => {
    const inputs = document.querySelectorAll("#achievement-boxes input");
    let achievements = [];

    inputs.forEach((input) => {
        achievements.push(input.value);
    });

    return achievements;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-player-form");
    form.reset();
    form._id = "-1";
    document.getElementById("achievement-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Player";
    resetForm();
};

const addAchievement = (e) => {
    e.preventDefault();
    const section = document.getElementById("achievement-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

window.onload = () => {
    showSoccerPlayers();
    document.getElementById("add-edit-player-form").onsubmit = addEditPlayer;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-achievement").onclick = addAchievement;
};
