const express = require('express');
const Enmap = require('enmap');
const EnmapMongo = require("enmap-mongo");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "!";
const request = require('request');
var cheerio = require('cheerio');
client.servers = new Enmap({ provider: new EnmapMongo({
  name: `scpslinfo`,
  dbName: `scpslinfo`,
  url: process.env.MONGOLAB_URI
})
})
client.titles = new Enmap({ provider: new EnmapMongo({
  name: `scpsltitle`,
  dbName: `scpsltitle`,
  url: process.env.MONGOLAB_URI2
})
})
client.on("ready", () => {
  console.log("Let's go bb");
  client.user.setPresence({ game: { name: '!serverhelp' }, status: 'idle' });
});
client.on("guildCreate", (guild) => {
console.log(guild.name)
});
client.on("message", (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift();
  const argu = args.join(" ")
  
  
  if (!message.content.startsWith(prefix)) return;
  //rox and pie only
  if(message.author.id === "155685040750198784"||message.author.id=== "265953906951979019") {
      if (command === "stat") {
      client.user.setPresence({ game: { name: argu }, status: 'idle' });
      message.channel.send("status set to **"+argu+"**")
  }
 
  //Get all guilds the bot is in
   if (command === "collection") {
  message.channel.send(client.guilds.array())
  }
  }
  //rest of the peoples
  //Set the command ip and port
  if (command === "set") {
    if (!message.member.permissions.has('ADMINISTRATOR')){
      message.channel.send("``Administrators only!``");
      return; }
    if (args.length != 3) {
    message.channel.send("``!set [commandname] [ip] [port]``");
      return; }
    if (client.servers.has(message.guild.id+args[0])) {
        if (client.servers.get(message.guild.id+args[0])[0] === args[1]) {
            if (client.servers.get(message.guild.id+args[0])[1] === args[2]) {
              
                message.channel.send("``Exact command already exists.``");
            } 
            else {
                client.servers.set(message.guild.id+args.shift(), args);
                message.channel.send("``Port successfully changed.``");
            }
        }  
        else if (client.servers.get(message.guild.id+args[0])[1] === args[2]) {
            client.servers.set(message.guild.id+args.shift(), args);
            message.channel.send("``IP successfully changed.``");
        } 
        else {
        client.servers.set(message.guild.id+args.shift(), args);
            message.channel.send("``IP and port successfully changed.``");
        }
    } else {
        client.servers.set(message.guild.id+args.shift(), args);
        message.channel.send("``Command successfully added.``");
    }
  }
  //delete the command
  if (command === "del") {
  if (!message.member.permissions.has('ADMINISTRATOR')){
      message.channel.send("``Administrators only!``");
      return; }
    if (args.length != 1) {
    message.channel.send("``!del [commandname]``");
      return; }
      else {
        const comm = args.shift();
        if (client.servers.has(message.guild.id+comm)) {
            client.servers.delete(message.guild.id+comm);
            message.channel.send("``Command successfully deleted.``")
  } else {
  message.channel.send("``That commandname doesn't exist.``");
  }
  }
  }
  //set the title
  if (command === "title") {
  if (!message.member.permissions.has('ADMINISTRATOR')){
      message.channel.send("``Administrators only!``");
      return; }
    if (args.length != 2) {
    message.channel.send("``!title [commandname] [title]``");
      return; }
      else {
        if (client.servers.has(message.guild.id+args[0])) {
        client.titles.set(message.guild.id+args.shift(), args);
            message.channel.send("``Title successfully added.``")
      } else {
        message.channel.send("``That commandname doesn't exist.``")
      }
  }
  }
     //list all the commands for that guild
  if (command === "list") {
    function hasGuild (value) {
    return value.startsWith(message.guild.id);
    }
    const array = client.servers.keyArray().filter(hasGuild)
if (array.length != 0) {
  for (var i = 0; i < array.length; i++) {
    array[i] = array[i].split(message.guild.id).join("");
  }
  message.channel.send(message.guild.name+" has\n``"+array.join('\n')+"``");
} else {
  message.channel.send("``No commands have been made. Use !set to add some!``")
}
  }
  //serverhelp
  if (command === "serverhelp") {
   message.author.send({"embed": {
    "color": 2314137,
    timestamp: new Date(),
    "title": "Server Info Bot Documentation",
    "description": "This part of the bot can be used to input your own server into the bot and then have it display the status of your server(s). It will display: ip, port, player count, server status. One can easily add multiple servers to the bot and can also remove them if needed.",
    "url": "https:\/\/tinyurl.com\/scpserverbot",
    "footer": "For assistance or to report a bug, message roxyyy136#1012 or PieFace#5319",
        fields: [{
          name: "**!set [commandname] [serverip] [serverport]**",
          value: "Will set the name of the command, ip, and port. For EX. ``!set ss1 192.223.31.157 7778`` would make the bot display the info on the server with the ip 192.223.31.157 and port 7778 every time someone says ``!ss1``"
        },
        {
          name: '**!del [commandname]**',
          value: "Deletes the specified command. For EX. \`\`!del ss1\`\` would delete the server command \`\`!ss1\`\`."

        },
        {
          name: '**!title [commandname] [title]**',
          value: "Sets the title for the servers info card. For EX. \`\`!title ss1 Server 1\`\` would make the title of the info card be \`\`Server 1\`\`." 
        },
        {
          name: '**!list**',
          value: "Lists all commands available in the current server."

        },
        {
          name: '***Notes***',
          value: "If you input the wrong ip or port the bot will show the server as offline. If the port on the server changes it will be shown as offline unless you update the port. To run the setup commands you must have the administrator permission."
        }
          ],
      }
     }); 
}
  //get the server status
  if (client.servers.has(message.guild.id+command)) {
    var theip = (client.servers.get(message.guild.id+command)[0]);
    var portEnd = (client.servers.get(message.guild.id+command)[1]);
    if (!client.titles.has(message.guild.id+command)) {
        var theTitle = "Server";
        } else {
        var theTitle = (client.titles.get(message.guild.id+command));
        }
    if (!isNaN(theip.split(".").join(""))) {
               request(`https://api.scpslgame.com/lobbylist.php?format=json`, function(err, resp, html) {
        if (!err){
    {
              var json = JSON.parse(html);
     if ("error" in json) {
     console.log("wtf0");
     } else {
       var obj = json.find(o => o.ip === theip && o.port === portEnd);
          if(!obj) {
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called in "+message.guild.name+", but it was offline");
           message.channel.send({"embed": {
    "color": 9245716,
    timestamp: new Date(),
    "title": `${theTitle}`,
     "author": {
      "name": "SCP Secret Laboratory [OFFLINE]",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: `${theip}`,
          inline: true
        },
        {
          name: "PORT:",
          value: `${portEnd}`,
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
          } else {
            var playerCount = obj.players
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called in "+message.guild.name+", and it had "+playerCount+" people");
                      message.channel.send({"embed": {
    "color": 3498293,
    timestamp: new Date(),
    "title": `${theTitle}`,
     "author": {
      "name": "SCP Secret Laboratory",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: `${theip}`,
          inline: true
        },
        {
          name: "PORT:",
          value: `${portEnd}`,
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
     } 
            }
      }    
});
    } else {
     request(`https://kigen.co/scpsl/getinfo.php?ip=${theip}&port=${portEnd}`, function(err, resp, html) {
        if (!err){
          var $ = cheerio.load(html); 
                      if (html === '{"error":"Server not found"}') {
     console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called differently in "+message.guild.name+", but it was offline");
          message.channel.send({"embed": {
    "color": 9245716,
    timestamp: new Date(),
    "title": `${theTitle}`,
     "author": {
      "name": "SCP Secret Laboratory [OFFLINE]",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: `${theip}`,
          inline: true
        },
        {
          name: "PORT:",
          value: `${portEnd}`,
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
            } else {
              var json = JSON.parse(html);
     
     if ("error" in json) {
     console.log("wtf0");
     } else {
          var playerCount = json.players;
          
     }
               console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called differently in "+message.guild.name+", and it had "+playerCount+" people");
            message.channel.send({"embed": {
    "color": 3498293,
    timestamp: new Date(),
    "title": `${theTitle}`,
     "author": {
      "name": "SCP Secret Laboratory",
      "icon_url": "http://scp-sl.wdfiles.com/local--files/nav:side/scp-sl-logo.png"
     },
        fields: [{
          name: "IP:",
          value: `${theip}`,
          inline: true
        },
        {
          name: "PORT:",
          value: `${portEnd}`,
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
      }    
 });
    }
  }
  });
client.login(process.env.BOT_TOKEN);
