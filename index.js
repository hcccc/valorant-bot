require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const characterList = [
  "ジェット",
  "セージ",
  "ソーヴァ",
  "フェニックス",
  "ブリムストーン",
  "ヴァイパー",
  "オーメン",
  "サイファー",
  "ブリーチ",
  "レイズ",
  "レイナ",
  "キルジョイ",
];
const mapList = ["アセント", "バインド", "スプリット", "ヘイヴン"];

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
};

tips = [
  "味方がキルやデスをしたらミニマップを一瞬だけ見る。どこで何が起きているかを把握することはとても大事。",
  "ピストルラウンドで敗北したら2ndでは自分の所持金額が1500以下にならないようにスキルだけを購入してエコをする。",
  "このゲームでピストル敗北後の無理buyはかなりリスクが高い。",
  "位置報告はする。",
  "セージをプレイするなら回復スキルを使用する前に死ぬことはできるだけ避けるようにする。",
  "スモーク持ちのキャラを使うならば味方のスナイパーがどこを見ているかよく注意する。 味方のスナイパーの射線を遮るスモークは最悪だ。",
  "オーメンのシュラウドステップは発動時、 移動前の場所から音はするが移動後の場所では音がならないので注意。",
  "味方と必ずbuyを合わせる。 一人だけエコやbuyをしてはいけない。",
  "胴体を当たらないスプレーで狙うよりも頭を単発で狙うほうが何倍も強い。",
  "武器の切り替え音は敵に聞こえない",
  "防衛で連続でラウンドを取られるようなら味方に配置換えを提案したほうが良い。",
  "スモーク越しのフラッシュは当たらない。",
  "攻撃側で爆弾設置後、 君が死んでるならボムにピンを打ってあげよう。",
  "ヴァンダル、 ファントムでADSをするのは弱い。",
  "自分達が防衛側で敵にサイファーがいる場合おそらく裏警戒のワイヤーを張っているだろうが、 敵が来ないのであればプッシュし、 ワイヤーだけを破壊して下がるのもいい。 敵は常に裏に意識をさかないといけなくなる。",
  "ブリーチのスタンやオーメンのパラノイアを撃つとき味方に当てないよう注意しよう。",
  "自分が死んだらなぜ死んだかを考える。",
  "スキルの音は構えただけでは敵に聞こえない。 発動して初めて敵に聞こえる,",
  "ワイヤーをはるときはしゃがんで自分の目線の位置にはると間違いない。",
  "サイファーやソーヴァをプレイしているなら狭い場所（ バインドのフッカーやヘイブンのガレージ） に入るとき必ずカメラやドローンを入れる。",
  "デュエリストをプレイするなら必ず一番前に出る。 前に出ないデュエリストはチームに不必要。",
  "チームにスナイパーは1人でいい。 他の味方がスナイパーをやりたいなら君は我慢しよう。",
  "相手がエコのときは1人で死んではいけない。 君1人の命のほうが相手1人の命より重い。",
  "このゲームは待ちよりも飛び出しのほうが強い。 これを忘れないで。, でも不要な飛び出しはいらない",
  "スパイクを設置するとチーム全員に300クレジットはいる。 ラウンド勝利が確定しても設置できるならしてしまおう。",
  "常にヘッドラインを意識する。 移動するときも照準は頭の位置に。",
  "いいデバイスに変えて上手くなるかは分からないが上手い人はみんないいデバイスを使っている。",
  "味方がサイト手前に集まっているならさっさとスモークを炊いてあげてラッシュするべき。 敵は寄ってくる。",
  "サイト手前で固まってる時間が長すぎて敵が集まってきているならもう一方のサイトに切り替えしたり、 切り替えしたと見せかけて時間をおいて再度攻めるなどの駆け引きを意識する。",
  "セージの壁は撃てば破壊できる。",
  "フェニックスのultからは極力逃げたほうが良い。 下がって時間切れさせることが大事。 撃ち合う必要はない。",
  "マーシャルの腰撃ちはかなり精度がいい。",
  "セージの蘇生はどんどん回すべき。 ときには金の節約のために使ってもいい。",
  "ブリムストーンとソーヴァをメインでプレイするならばモロトフと弓のポジションは覚えよう。",
  "スパイクを相手が解除してるときは赤く光る。 解除音が鳴っても赤く光ってなければフェイクだ。",
  "スキルを構えたまま敵のいそうな場所に顔を出さない。",
  "解除音がなったらとりあえずピークする。 撃ち合うのではなくピークをする",
  "歩きながら撃たない",
];

const cheerMessage = "ふぁいてぃ～～～～～～～～～～ん:partying_face: :partying_face: :partying_face: :partying_face:";

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  if (msg.content.startsWith("!chara")) {
    msg.reply(pickMyChara());
  } else if (msg.content.startsWith("!map")) {
    var map = mapList[Math.floor(Math.random() * mapList.length)];
    msg.reply(map);
  } else if (msg.content.startsWith("!score")) {
    msg.reply(showMyScore(msg.author.id));
  } else if (msg.content.startsWith("!weapon")) {
    msg.reply(pickMyWeapon());
  } else if (msg.content.startsWith("!combo")) {
    var output =
      pickMyChara() +
      "\n" +
      pickMyWeapon() +
      "\n" +
      showMyScore(msg.author.id) +
      "\n" +
      showMyKillGoal(msg.author.id) +
      "\n" +
      getTip();
    if (msg.author.id == "242004702005297152") {
      output = output + ("\n" + spMessage());
    }
    msg.reply(output);
  } else if (msg.content.startsWith("!goal")) {
    msg.reply(showMyKillGoal(msg.author.id));
  } else if (msg.content.startsWith("!tip")) {
    msg.reply(getTip());
  } else if (msg.content.startsWith("!f")) {
    msg.reply(cheerMessage);
  } else if (msg.content.startsWith("!suihan")) {
    msg.channel.send("炊飯じゃーにー" + cheerMessage);
  } else if (msg.content.startsWith("!gozi")) {
    msg.channel.send("ゴジライン" + cheerMessage);
  } else if (msg.content.startsWith("rdy")) {
    msg.channel.send("fight");
  } else if (msg.content.startsWith("!team")) {
    if (msg.mentions.users.size) {
      const playerList = msg.mentions.users.map((user) => {
        return new playerData(user.id, user.username);
      });

      if (playerList.length % 2 != 0) {
        msg.reply(
          "チームに偶数人いないと始まらないよ, botはカウントされません"
        );
      } else {
        shuffleArray(playerList);
        var teams = splitTeam(playerList);
        if (teams.length == 0) {
          msg.channel.send(
            "そのメンバーでは近い実力のチーム分けができないよ、カス"
          );
        } else {
          var output = generateTeamOutput(teams[0], teams[1]);
          msg.channel.send(output[0]);
          msg.channel.send(output[1]);
        }
      }
    } else {
      msg.reply("チームに入れる人を指定してちょ");
    }
  }
});

function pickMyChara() {
  return characterList[Math.floor(Math.random() * characterList.length)];
}

function pickMyWeapon() {
  if (Math.round(Math.random()) == 0) {
    return "ヴァンダル";
  } else {
    return "ファントム";
  }
}

function getTip() {
  return tips[Math.floor(Math.random() * tips.length)];
}

function showMyScore(playerId) {
  return "あなたの戦闘力は [" + playerScoreMap[playerId] + "] です。";
}

function showMyKillGoal(playerId) {
  const killMultiplier = 4;
  return (
    "頑張って" +
    Math.round(Math.random() * 10 + playerScoreMap[playerId] * killMultiplier) +
    "キル取ろう"
  );
}

function splitTeam(playerList) {
  const scoreDiffThreshold = 2;
  const maxRetryCount = 5;
  var team1;
  var team2;
  var totalSize = playerList.length;
  var teamScoreDiff = 999;
  var retryCount = 0;

  while (teamScoreDiff > scoreDiffThreshold) {
    if (retryCount > maxRetryCount) {
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
  var attacker = "アタッカー: ";
  var defender = "ディフェンダー: ";

  for (var i = 0; i < team1.length; i++) {
    if (i > 0) {
      attacker = attacker.concat(", ");
    } else {
      attacker = attacker.concat(" ");
    }
    attacker = attacker.concat(team1[i].username);
    attacker = attacker.concat("(" + playerScoreMap[team1[i].id] + ")");
  }
  attacker += "   -- 合計スコア: " + getTeamScore(team1);

  for (var j = 0; j < team2.length; j++) {
    if (j > 0) {
      defender = defender.concat(", ");
    } else {
      defender = defender.concat(" ");
    }
    defender = defender.concat(team2[j].username);
    defender = defender.concat("(" + playerScoreMap[team2[j].id] + ")");
  }
  defender += "   -- 合計スコア: " + getTeamScore(team2);

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