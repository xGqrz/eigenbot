const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);

  var jsFiles = files.filter(f => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) {
    console.log("Geen files gevonden");
    return;
  }

  jsFiles.forEach((f, i) => {

    var fileGet = require(`./commands/${f}`);
    console.log(`De file ${f} is geladen`);

    bot.commands.set(fileGet.help.name, fileGet);

  })


});

bot.on("ready", async () => {

  console.log(`${bot.user.username} is online!`)
  bot.user.setActivity('-new | -help', { type: 'WATCHING' })

});
  
bot.on("guildMemberAdd", member => {
   
  var role = member.guild.roles.find("name","👉Bezoeker");
  console.log(role)
  member.addRole(role.id);
  
})

bot.on("message", async message => {
  if (message.author.bot) return;

  if (message.channel.type === "dm") return;

  var prefixes = JSON.parse(fs.readFileSync("./prefixes.json"));
  if (!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
    prefixes: botConfig.prefix
  };

  }
  var prefix = prefixes[message.guild.id].prefixes;
  // var prefix = botConfig.prefix;
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith("trigger")) return;

  var messageArray = message.content.split(" ");


  var command = messageArray[0];

  var arguments = messageArray.slice(1);

  var commands = bot.commands.get(command.slice(prefix.length));

  if(commands) commands.run(bot,message, arguments);

});

bot.login(botConfig.token);