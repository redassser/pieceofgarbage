var Discord = require("discord.js");
var client = new Discord.Client();
var config = require("./config.json");
var request = require('request');
var cheerio = require('cheerio');
var search = require('youtube-search');
var fs = require("fs");
var warnings = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
var commandi = JSON.parse(fs.readFileSync("./commands.json", "utf8"));
var prefix = "?";
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
};
client.on("ready", () => {
  console.log("I am ready!");
});
client.on("message", (message) => {
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();
  var argu = args.join(" ");
  var argo = argu.replace(args[0], "");
   if (!message.content.startsWith(prefix)) return;
  if (command === "sea") {
    var opts = {
  maxResults: 3,
  key:  process.env.YT_TOKEN,
  type: "video"
};
 
search(argu, opts, function(err, results) {
  if(err) return console.log(err);
  message.channel.send({"embed": {
    "color": 9245716,
    timestamp: new Date(),
    "title": `Youtube results for '${argu}'`,
     "author": {
      "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/YouTube_social_white_circle_%282017%29.svg/1000px-YouTube_social_white_circle_%282017%29.svg.png"
     },
        fields: [{
          name: "1",
          value: `${results[0]['title']}`,
        },
        {
          name: "2",
          value: `${results[1]['title']}`,
        },
        {
          name: "3",
          value: `${results[2]['title']}`,
        }
          ],
      }
     })    
     .then(function(){
        message.channel.awaitMessages(response => message.content, {
          max: 1,
          time: 5000,
          errors: ['time'],
        })
        .then((collected) => {
            message.channel.send(`${results[collected.first().content-1]['link']}`);
          })
          .catch(function(){
            message.channel.send('You didn\'t write 1, 2 or 3');
          });
      });
});
  }
  if (command === "ping" && !isNaN(args[1]) && message.isMentioned(message.mentions.members.first())) {
  console.log(`${message.mentions.members}`);
  console.log(message.guild.ownerID);
  if (message.guild.ownerID === message.author.id) {
  var step;
  if (args[1] <= 5) {
for (step = 0; step < args[1]; step++) {
  message.channel.send(`${args[0]}`);
}
  } else {
    for (step = 0; step < args[1]; step+=5) {
  message.channel.send(`${args[0]} ${args[0]} ${args[0]} ${args[0]} ${args[0]}`);
}
  }
} else {
  message.channel.send("Nope.");
}
}
 if (command === "cc") {
    if (message.member.permissions.has('ADMINISTRATOR')) {
     if (!commandi[args[0]]) commandi[args[0]] = {
         command:argo,
       }; else {
         message.channel.send("That command already exists!");
         return;
       }
       fs.writeFile("./commands.json", JSON.stringify(commandi), (err) => {
          if (err) console.error(err)
  });
  var userWarns = commandi[args[0]] ? commandi[args[0]].command : argo;
     message.channel.send(`${args[0]} now does \'${userWarns}\'`);
     } else {
  message.channel.send("Nope!");
     }
     }
  if (commandi[command]) {
    var userWarns = commandi[command] ? commandi[command].command:args[1];
    message.channel.send(userWarns);
  }
  if (command === "warn") {
      if (message.member.permissions.has('ADMINISTRATOR')) {
     if (!warnings[message.mentions.members.first()]) warnings[message.mentions.members.first()] = {
    points: 0,
  };
  warnings[message.mentions.members.first()].points++;
    fs.writeFile("./warnings.json", JSON.stringify(warnings), (err) => {
    if (err) console.error(err)
  });
   var userWarns = warnings[message.mentions.members.first()] ? warnings[message.mentions.members.first()].points : 0;
     message.channel.send(`${message.mentions.members.first()} now has ${userWarns} warnings!`);
     
   } else {
    message.channel.send("Nope!"); 
   }
   }
  
  if (command === "cah") {
    var randomCAH = config.whiteCard[Math.floor(Math.random()*config.whiteCard.length)];
    message.channel.send({embed: {
    color: 15844367,
    author: {
      name: `${message.author.username} says...`,
      icon_url: message.author.avatarURL
    },
    title: `${argu}\n${randomCAH}`,
    }
    })
    message.delete();
  }
  if (command === "status") {
    var statusgame = argu
  client.user.setActivity(`${statusgame}`);
  }
    if (command === "ss0") {
      var ar = [7777,7778,7779,7780,7781,7782,7783,7784];
var ar2 = ar.map( function(v) {
    if ( typeof v === 'string' ) {
        return v.charAt(0).toUpperCase() + v.slice(1);
    } else {
        return v;
    }
} );
console.log( ar2 ); 
    request('https://kigen.co/scpsl/getinfo.php?ip=192.223.27.212&port=7779', function(err, resp, html) {
        if (!err){
          var $ = cheerio.load(html); 
          
            if (html === '{"error":"Server not found"}') {
              message.channel.send({"embed": {
    "color": 9245716,
    timestamp: new Date(),
    "title": "Official SCP: Secret Laboratory Server",
     "author": {
      "name": "SCP Secret Laboratory [OFFLINE]",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: "192.223.27.212",
          inline: true
        },
        {
          name: "PORT:",
          value: "7779",
          inline: true
        },
        {
          name: "PLAYERS:",
          value: 'N/A',
          inline: true
        }
          ],
      }
     }); 
            }
            else {
           var json = JSON.parse(html);
     
     if ("error" in json) {
     console.log("wtf0");
     } else {
          var playerCount = json.players;
          
     }
            message.channel.send({"embed": {
    "color": 3498293,
    timestamp: new Date(),
    "title": "Official SCP: Secret Laboratory Server",
     "author": {
      "name": "SCP Secret Laboratory",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: "192.223.27.212",
          inline: true
        },
        {
          name: "PORT:",
          value: "7779",
          inline: true
        },
        {
          name: "PLAYERS:",
          value: `${playerCount}`,
          inline: true
        }
          ],
      }
     });  
            }
            
            console.log(html);
      }
     
});
  }
  if (command === "vote" && argu != "") {

    message.channel.send({embed: {
    color: 15844367,
    author: {
      name: `${message.author.username} is calling a vote!`,
      icon_url: message.author.avatarURL
    },
    title: `${argu}`,
    }
    }).then(newMessage => {
   newMessage.react('✅')
   newMessage.react('❌')
        // (catch errors)
        .catch(console.error);
    })
    // (catch errors)
    .catch(console.error);
    message.delete();  
};
  if (command === "8ball" && argu != "") {
    
    var randomResponse = config.myArray[Math.floor(Math.random()*config.myArray.length)];
    message.channel.send(`Your question was '${argu}' \nThe magic 8 ball says... '` + randomResponse + `'`);
    message.delete();
  }
  if (command === "spam") {
    message.channel.send("spam");
  } 
  if (command === "yeet" && message.author.username != "a piece of garbage" && argu != "") {
    var myOtherArray = [
      `${argu} got yoted by ${message.author}!`,
      `${message.author} yote ${argu}!`,
      `${message.author} failed to yeet ${argu}!`,
      `${argu} got FREAKING YATE by ${message.author}!`,
      `${argu} deflected the YEET back at ${message.author}!`
      ]        
    var randomYeet = myOtherArray[Math.floor(Math.random()*myOtherArray.length)];
    message.channel.send(randomYeet);
    message.delete();
  } 
  if (command === "rng"&& message.author.username != "a piece of garbage") {
    var number1 = Math.ceil(args[0]);
    var number2 = Math.floor(args[1]);
    var rn = Math.floor(Math.random() * (number2 - number1)) + number1;
    
    message.channel.send(`Your number is ${rn}.`);
  }
  if (command === "swear") {
   
   var embedPic = config.picArray[Math.floor(Math.random()*config.picArray.length)];
   message.channel.send(embedPic); 
   message.delete();
  }
  if (command === "help") {
    message.channel.send({embed: {
    color: 15844367,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "GarbageBot's commands",
    description: "The prefix used for GarbageBot is the question mark, and it doesn't matter if the command is capitalized. [?]",
    fields: [{
        name: "?vote [Yes/No Vote question]",
        value: "Replies with your question and two reaction emojis attached. Other have the ability to vote using the reactions."
      },
      {
        name: "?Spam",
        value: "Replies with **'spam'**"
      },
      {
        name: "?Yeet [text]",
        value: "Replies with a random phrase containing the [text] and [author]"
      },
      {
        name: "?rng [min #] [max #]",
        value: "Replies with **'Your number is [number between your min and max]'**"
      },
      {
        name: "?status [text]",
        value: "Replaces the *Playing* in the bot's profile with **[text]**'"
      },
      {
        name: "?8ball [question]",
        value: "Responds with \n**'Your question was '[question]' \nThe magic 8 ball says... '[randomly generated response]''**"
      },
      {
        name: "?swear",
        value: "Replies with a random picture telling all the christian boys and girls not to swear.\nSwear and you'll get a <:ban:454415638929211403>😡<:ban:454415638929211403>😤"
      },
      {
        name: "?cah",
        value: "Replies with a random *White Card* response from Cards Against Humanity."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "> ?help < if you need this again"
    }
    }
  });
}
});
client.login(process.env.BOT_TOKEN);
