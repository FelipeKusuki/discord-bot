import Discord from 'discord.js';
import Play from './app-methods/play';
import Playlist from './app-methods/playList';
import Shared from './shared/shared';
import Skip from './app-methods/skip';
import Stop from './app-methods/stop';
import Search from './app-methods/search';
import Formatter from './formatter/formatter';
import QueueService from '../service/queue.service';
import environment from '../infra/environment';

console.log('BOM DIA MARCELO, INICIOU APLICAÇÃO')
const client = new Discord.Client();
// const queue = new Map();


const readMessage = async (message: Discord.Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(environment.prefix)) return;
    let serverQueue = QueueService.get(message.guild.id);

    if (Shared.command(message, 'play')) {
        Play.isLink(message.content) ? Play.execute(message, serverQueue, false) : Search.search(message);
        return;
    } else if (Shared.command(message, 'first')) {
        Play.isLink(message.content) ? Play.execute(message, serverQueue, true) : Search.search(message);
        return;
    } else if (Shared.command(message, 'list')) {
        Playlist.addPlaylist(message);
        return;
    } else if (Shared.command(message, 'skip')) {
        Skip.skip(message, serverQueue);
        return;
    } else if (Shared.command(message, 'stop')) {
        Stop.stop(message, serverQueue);
        return;
    } else if (Shared.command(message, 'leave')) {
        serverQueue.voiceChannel.leave();
    } else if (Shared.command(message, 'queue')) {
        let queue = Formatter.formatQueue(serverQueue);
        message.channel.send(queue);
    } else if (parseInt(message.content.replace(environment.prefix, ""))) {
        if (!(message.author.id in Search.getSearchSession())) {
            message.channel.send('You have to search for something before choose an item from the list.');
        } else {
            const nextMusic = Search.getLastCommandById(message.author.id) == 'first';
            Play.playSearch(message, serverQueue, nextMusic);
        }
    }
    else {
        message.channel.send('You need to enter a valid command!');
    }
}

const onReady = () => { console.log('Bot ready') }
const onReconnecting = () => { console.log('Bot ready') }
const onDisconnect = () => { console.log('Bot ready') }

client.login(environment.token);
client.once('ready', onReady);
client.once('reconnecting', onReconnecting);
client.once('disconnect', onDisconnect);
client.on('message', readMessage);