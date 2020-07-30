require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const characterList = [
    'ジェット', 'セージ', 'ソーヴァ', 'フェニックス', 'ブリムストーン', 'ヴァイパー',
    'オーメン', 'サイファー', 'ブリーチ', 'レイズ', 'レイナ', 'キルジョイ'
];
const mapList = ['アセント', 'バインド', 'スプリット', 'ヘイヴン'];

const playerScoreMap = {
    "428565967199666178": 5, // ちろる
    "300561135277572096": 5, // とむら
    "275203657052585985": 4, // hanjiu
    "313373642987798529": 4, // hokkaido
    "170858254660796417": 3, // totsu
    "311717648511795200": 2, // どりでん 
    "242004702005297152": 2, // kamishiro
    "259716748901613568": 2, // sabunero
    "127041758239391744": 2, // calpis 
    "271670378584211458": 2, // hc
    "319770578947014656": 2, // dori
    "344107555741761536": 2, // mito
    "185689334211543040": 2, // rosian
    "313717914442137601": 1, // koichi
    "185361242049740800": 1, // terumi
}

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content.startsWith('!chara')) {
        msg.reply(pickMyChara());
    } else if (msg.content.startsWith('!map')) {
        var map = mapList[Math.floor(Math.random() * mapList.length)];
        msg.reply(map);
    } else if (msg.content.startsWith('!score')) {
        msg.reply(showMyScore(msg.author.id));
    } else if (msg.content.startsWith('!weapon')) {
        msg.reply(pickMyWeapon());
    } else if (msg.content.startsWith('!combo')) {
        var output = pickMyChara() + '\n' +
            pickMyWeapon() + '\n' + showMyScore(msg.author.id) + '\n' +
            showMyKillGoal(msg.author.id);
        if (msg.author.id == "242004702005297152") {
            output = output + ('\n' + spMessage());
        }
        msg.reply(output);
    } else if (msg.content.startsWith('!goal')) {
        msg.reply(showMyKillGoal(msg.author.id));
    } else if (msg.content.startsWith('!team')) {
        if (msg.mentions.users.size) {
            const playerList = msg.mentions.users.map(user => {
                return new playerData(user.id, user.username);
            });

            if (playerList.length % 2 != 0) {
                msg.reply('チームに偶数人いないと始まらないよ, botはカウントされません');
            } else {
                shuffleArray(playerList);
                var teams = splitTeam(playerList);
                if (teams.length == 0) {
                    msg.channel.send('そのメンバーでは近い実力のチーム分けができないよ、カス');
                } else {
                    var output = generateTeamOutput(teams[0], teams[1]);
                    msg.channel.send(output[0]);
                    msg.channel.send(output[1]);
                }
            }

        } else {
            msg.reply('チームに入れる人を指定してちょ');
        }
    }
});

function pickMyChara() {
    return characterList[Math.floor(Math.random() * characterList.length)];
}

function pickMyWeapon() {
    if (Math.round(Math.random()) == 0) {
        return 'ヴァンダル';
    } else {
        return 'ファントム';
    }
}

function showMyScore(playerId) {
    return 'あなたの戦闘力は [' + playerScoreMap[playerId] + '] です。';
}

function showMyKillGoal(playerId) {
    return '頑張って' + Math.round(Math.random() * 10 + playerScoreMap[playerId] * 4) + 'キル取ろう';
}

function splitTeam(playerList) {
    var team1;
    var team2;
    var totalSize = playerList.length;
    var teamScoreDiff = 999;
    var retryCount = 0;

    while (teamScoreDiff > 2) {
        if (retryCount > 5) {
            return [];
        }

        team1 = [];
        team2 = [];

        for (var i = 0; i < totalSize; i++) {
            if (Math.round(Math.random()) == 0 && team1.length < totalSize / 2) {
                team1.push(playerList[i]);
            } else {
                if (team2.length >= totalSize / 2) {
                    team1.push(playerList[i]);
                } else {
                    team2.push(playerList[i]);
                }
            }
        }

        teamScoreDiff = Math.abs(getTeamScore(team1) - getTeamScore(team2));
        retryCount++;
    }

    return [team1, team2];
}


function generateTeamOutput(team1, team2) {
    var attacker = 'アタッカー: ';
    var defender = 'ディフェンダー: ';

    for (var i = 0; i < team1.length; i++) {
        if (i > 0) {
            attacker = attacker.concat(', ');
        } else {
            attacker = attacker.concat(' ');
        }
        attacker = attacker.concat(team1[i].username);
        attacker = attacker.concat('(' + playerScoreMap[team1[i].id] + ')');
    }
    attacker += '   -- 合計スコア: ' + getTeamScore(team1);

    for (var j = 0; j < team2.length; j++) {
        if (j > 0) {
            defender = defender.concat(', ');
        } else {
            defender = defender.concat(' ');
        }
        defender = defender.concat(team2[j].username);
        defender = defender.concat('(' + playerScoreMap[team2[j].id] + ')');
    }
    defender += '   -- 合計スコア: ' + getTeamScore(team2);

    return [attacker, defender];
}

function getTeamScore(team) {
    var score = 0;
    for (var i = 0; i < team.length; i++) {
        const player = team[i];
        score += playerScoreMap[player.id];
    }

    return score;
}

function playerData(id, username) {
    this.id = id;
    this.username = username;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function spMessage() {
    return "かみしろセージちゃんと壁張って";
}