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
    if (!message.member.permissions.has('ADMINISTRATOR')){message.channel.send("``Administrators only!``");return}
    if (args.length != 3) {message.channel.send("``!set [commandname] [ip] [port]``");return}
    if (client.servers.has(message.guild.id+args[0])) {
      if (client.servers.get(message.guild.id+args[0])[0] === args[1]) {
        if (client.servers.get(message.guild.id+args[0])[1] === args[2]) {
          message.channel.send("``Exact command already exists.``");
        } else {
          client.servers.set(message.guild.id+args.shift(), args);
          message.channel.send("``Port successfully changed.``");
        }
      } else if (client.servers.get(message.guild.id+args[0])[1] === args[2]) {
        client.servers.set(message.guild.id+args.shift(), args);
        message.channel.send("``IP successfully changed.``");
      } else {
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
    if (!message.member.permissions.has('ADMINISTRATOR')){message.channel.send("``Administrators only!``");return}
    if (args.length != 1) {message.channel.send("``!del [commandname]``");return}
    const comm = args.shift();
    if (client.servers.has(message.guild.id+comm)) {
      client.servers.delete(message.guild.id+comm);
      message.channel.send("``Command successfully deleted.``")
    } else {
      message.channel.send("``That commandname doesn't exist.``");
    }
  }
  //set the title
  if (command === "title") {
    if (!message.member.permissions.has('ADMINISTRATOR')){message.channel.send("``Administrators only!``");return}
    if (args.length < 2) {message.channel.send("``!title [commandname] [title]``");return}
    if (client.servers.has(message.guild.id+args[0])) {
      client.titles.set(message.guild.id+args.shift(), args.join(" "));
      message.channel.send("``Title successfully added.``")
    } else {
      message.channel.send("``That commandname doesn't exist.``")
    }
  }
     //list all the commands for that guild
  if (command === "list") {
    function hasGuild (value) {
      return value.startsWith(message.guild.id);
    }
    const array = client.servers.keyArray().filter(hasGuild)
    if (array.length === 0) {
      for (var i = 0; i < array.length; i++) {message.channel.send("``No commands have been made. Use !set to add some!``");return}
        array[i] = array[i].split(message.guild.id).join("");
      }
      message.channel.send(message.guild.name+" has\n``"+array.join('\n')+"``");
  }
  //serverhelp
  if (command === "serverhelp") {
    message.channel.send("``You have been sent a direct message.``")
    let serverhelp = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle("Server Info Bot Documentation")
      .setURL("https:\/\/tinyurl.com\/scpserverbot")
      .setFooter("For assistance or to report a bug, message roxyyy136#1012 or pie#5319")
      .setDescription("This part of the bot can be used to input your own server into the bot and then have it display the status of your server(s). It will display: ip, port, player count, server status. One can easily add multiple servers to the bot and can also remove them if needed.")
      .addField("**!set [commandname] [serverip] [serverport]**","Will set the name of the command, ip, and port. For EX. ``!set ss1 192.223.31.157 7778`` would make the bot display the info on the server with the ip 192.223.31.157 and port 7778 every time someone says ``!ss1``")
      .addField('**!del [commandname]**',"Deletes the specified command. For EX. \`\`!del ss1\`\` would delete the server command \`\`!ss1\`\`.")
      .addField('**!title [commandname] [title]**',"Sets the title for the servers info card. For EX. \`\`!title ss1 Server 1\`\` would make the title of the info card be \`\`Server 1\`\`." )
      .addField('**!list**',"Lists all commands available in the current server.")
      .addField('**!specs [commandname]**',"Some specifics about the server.\n``Server mod version, Region, Version, Pastebin, Official status.``")
      .addBlankField(true)
      .addField('***Notes***',"If you input the wrong ip or port the bot will show the server as offline. If the port on the server changes it will be shown as offline unless you update the port. To run the setup commands you must have the administrator permission.");
    message.author.send(serverhelp); 
  }
  //get the server status
  if (client.servers.has(message.guild.id+command)) {
    var theip = (client.servers.get(message.guild.id+command)[0]); var portEnd = (client.servers.get(message.guild.id+command)[1]);
    if (!client.titles.has(message.guild.id+command)) {
      var theTitle = "Server";
    } else {
      var theTitle = (client.titles.get(message.guild.id+command));
    }
    if (!isNaN(theip.split(".").join(""))) {
      request(`https://api.scpslgame.com/lobbylist.php?format=json`, function(err, resp, html) {
        if (err){message.channel.send("Sorry, "+err);return}
        var json = JSON.parse(html);
        if ("error" in json) {
          console.log("oof ouch");
        } else {
          var obj = json.find(o => o.ip === theip && o.port === portEnd);
          if(!obj) {
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called in "+message.guild.name+", but it was offline");
            let ssoff = new Discord.RichEmbed()
              .setColor("RED")
              .setTimestamp()
              .setTitle(theTitle)
              .setAuthor("SCP Secret Laboratory [OFFLINE]","https://i.imgur.com/OmVlHWH.jpg")
              .addField("IP:",theip,true)
              .addField("PORT:",portEnd,true)
              .addField("PLAYERS:","N/A",true);
            message.channel.send(ssoff); 
          } else {
            var playerCount = obj.players
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called in "+message.guild.name+", and it had "+playerCount+" people");
            let sson = new Discord.RichEmbed()
              .setColor("GREEN")
              .setTimestamp()
              .setTitle(theTitle)
              .setAuthor("SCP Secret Laboratory","https://i.imgur.com/OmVlHWH.jpg")
              .addField("IP:",theip,true)
              .addField("PORT:",portEnd,true)
              .addField("PLAYERS:",playerCount,true);
            message.channel.send(sson); 
          }
        }     
      });
    } else {
      request(`https://kigen.co/scpsl/getinfo.php?ip=${theip}&port=${portEnd}`, function(err, resp, html) {
        if (!err){
          var $ = cheerio.load(html); 
          if (html === '{"error":"Server not found"}') {
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called differently in "+message.guild.name+", but it was offline");
            let ssaoff = new Discord.RichEmbed()
              .setColor("RED")
              .setTimestamp()
              .setTitle(theTitle)
              .setAuthor("SCP Secret Laboratory [OFFLINE]","https://i.imgur.com/OmVlHWH.jpg")
              .addField("IP:",theip,true)
              .addField("PORT:",portEnd,true)
              .addField("PLAYERS:","N/A",true);
            message.channel.send(ssaoff);
          } else {
            var json = JSON.parse(html);
            if ("error" in json) {console.log("wtf0");return}
            var playerCount = json.players;
            console.log(client.servers.get(message.guild.id+command)+" " +theTitle+" has been called differently in "+message.guild.name+", and it had "+playerCount+" people");
            let sson = new Discord.RichEmbed()
              .setColor("GREEN")
              .setTimestamp()
              .setTitle(theTitle)
              .setAuthor("SCP Secret Laboratory","https://i.imgur.com/OmVlHWH.jpg")
              .addField("IP:",theip,true)
              .addField("PORT:",portEnd,true)
              .addField("PLAYERS:",playerCount,true);
            message.channel.send(sson); 
          }  
        }    
      });
    }
  }
    //More specific 	
  if (command === "specs" ) {	
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {message.channel.send('``Moderators only!``');return}	
    if (args.length != 1){message.channel.send("``!specs [commandname]``");return}	
    if (!client.servers.has(message.guild.id+args[0])) {message.channel.send('``That commandname doesn\'t exist.``');return}	
    var theip = (client.servers.get(message.guild.id+args[0])[0]);var portEnd = (client.servers.get(message.guild.id+args[0])[1]);	
    if (!client.titles.has(message.guild.id+args[0])) {	
      var theTitle = "Server";	
    } else {	
      var theTitle = (client.titles.get(message.guild.id+args[0]));	
    }	
    request(`https://kigen.co/scpsl/getinfo.php?ip=${theip}&port=${portEnd}`, function(err, resp, html) {	
      if (!err){	
        var $ = cheerio.load(html); 	
        if (html === '{"error":"Server not found"}') {	
          console.log(client.servers.get(message.guild.id+args[0])+" " +theTitle+" has been called specifically in "+message.guild.name+", but it was offline");	
          message.channel.send("``This server is offline, so I can\'t get see its specs.``"); 	
        } else {	
          var json = JSON.parse(html);	
          if ("error" in json) {	
            console.log("wtf0");	
          } else {	
            var playerCount = json.players;	
            var smod = json.servermod;	
            var country = json.isoCode;	
            var vers = json.version;	
            var bin = json.pastebin;	
            var official;	
            (json.officialCode === "2") ? official = "YES" : official = "NO"  	
          }	
          console.log(client.servers.get(message.guild.id+args[0])+" " +theTitle+" has been called differently in "+message.guild.name+", and it had "+playerCount+" people");	
          let ssmore = new Discord.RichEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setTitle(theTitle)
            .setAuthor("SCP Secret Laboratory","https://i.imgur.com/OmVlHWH.jpg")
            .addField("IP:",theip,true)
            .addField("PORT:",portEnd,true)
            .addField("PLAYERS:",playerCount,true)
            .addField("SERVERMOD:",smod,true)
            .addField("REGION",country,true)
            .addField("VERSION",vers,true)
            .addField("PASTEBIN",bin,true)
            .addField("IS OFFICIAL",official,true)
          message.channel.send(ssmore);  
        }	
      }    	
    });	
  }
});
client.login(process.env.BOT_TOKEN);
