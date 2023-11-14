const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/image" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let soccerPlayers = [
    {
        _id: 1,
        name: "Lionel Messi",
        team: "Inter Miami",
        position: "Forward",
        nationality: "Argentina",
        goalsScored: 821,
        assists: 300,
        achievements: ["8x Ballon d'Or winner", "4x UEFA Champions League winner, " ],
        img: "image/messi.jpg",
    },
    {
        _id: 2,
        name: "Cristiano Ronaldo",
        team: "Al Nassr",
        position: "Forward",
        nationality: "Portugal",
        goalsScored: 858,
        assists: 200,
        achievements: ["5x Ballon d'Or winner", "5x UEFA Champions League winner"],
        img: "image/ronaldo.jpg",
    },
    {
        _id: 3,
        name: "Neymar Jr.",
        team: "Paris Saint-Germain",
        position: "Forward",
        nationality: "Brazil",
        goalsScored: 296,
        assists: 150,
        achievements: ["1x Copa Libertadores winner", "1x UEFA Champions League winner"],
        img: "image/neymar.jpg",
    },
    {
        _id: 4,
        name: "Kylian Mbappé",
        team: "Paris Saint-Germain",
        position: "Forward",
        nationality: "France",
        goalsScored: 296,
        assists: 80,
        achievements: ["1x FIFA World Cup winner", "2x Ligue 1 winner"],
        img: "image/mbappe.jpg",
    },
    {
        _id: 5,
        name: "Virgil van Dijk",
        team: "Liverpool",
        position: "Defender",
        nationality: "Netherlands",
        cleanSheets: 120,
        tackles: 300,
        achievements: ["1x UEFA Champions League winner", "1x Premier League winner"],
        img: "image/dijk.jpg",
    },
    {
        _id: 6,
        name: "Kevin De Bruyne",
        team: "Manchester City",
        position: "Midfielder",
        nationality: "Belgium",
        goalsScored: 60,
        assists: 180,
        achievements: ["2x PFA Players' Player of the Year", "4x Premier League winner" , "1x Champion Leage Winner"],
        img: "image/kevin.jpg",
    },
];

app.get("/api/soccerPlayers", (req, res) => {
    res.send(soccerPlayers);
});

app.post("/api/soccerPlayers", (req, res) => {
    const result = validateSoccerPlayer(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const newPlayer = (data) => {
        return {
            _id: soccerPlayers.length + 1,
            name: data.name,
            team: data.team,
            position: data.position,
            nationality: data.nationality,
            goalsScored: data.goalsScored,
            assists: data.assists,
            achievements: data.achievements.split(","),
        };
    };

    soccerPlayers.push(newPlayer(req.body));
    res.send(soccerPlayers);
});

const validateSoccerPlayer = (player) => {
    const schema = Joi.object({
        _id: Joi.allow(null),
        name: Joi.string().min(3).required(),
        team: Joi.string().min(3).required(),
        position: Joi.string().min(3).required(),
        nationality: Joi.string().min(3).required(),
        goalsScored: Joi.number().integer().min(0).required(),
        assists: Joi.number().integer().min(0).required(),
        achievements: Joi.array().items(Joi.string().min(3)).required(),
    });

    return schema.validate(player);
};

app.listen(3000, () => {
    console.log("I'm listening");
});
