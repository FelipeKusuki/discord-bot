const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    console.log('msg', msg);
    if (msg.content === 'ping') {
        msg.reply('Pongggg!');
    }
});

client.login('NTcxNTAzMzAyNTM0MjM0MTMy.Xadk-Q.egSxphBmdjg2-R39LgfGF9ZnDO4');