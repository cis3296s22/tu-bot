/** @module notification */
const { Client, Intents, MessageEmbed, Message, MessageReaction } = require('discord.js')
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});


/**@var {array} announcements */
var announcements = [];
/** 
 * @alias module:notification~notify
 * @param {string[]} splitMessage
 * @param {string} message
 */
function notify(splitMessage, message){
    
    //$tu notify add announcement -> adds an announcement to the list
    //$tu notify delete # -> adds an announcement to the list
    //$tu notify all-> notifies everyone who reacted to message


    const notifyEmbed = new MessageEmbed()
        .setTitle("How to create announcements and notify users with the notification role")
        .setDescription("Use $tu notify add to add an announcement\n"
            + "**Example: $tu notify add The final is on May 1st!\n**"
            + "Use $tu notify delete to delete an announcement from the list\n"
            + "**Example $tu delete 3\n**"
            + "Announcement 3 will be deleted\n"
            + "Use $tu notify clear to delete all announcements\n"
            + "Use $tu notify all to notify users of any announcements created\n\n")

    //if user only typed $tu notify without addition command
    if (!splitMessage[2]){
        message.channel.send({ embeds: [notifyEmbed] });
    }

    //add an announcement
    if(splitMessage[2] == 'add'){
        notifyAdd(splitMessage, message)
    }

    //delete announcement by id
    if(splitMessage[2] == 'delete'){
        notifyDelete(splitMessage, message)
    }//notifies role users of the announcements

    //clear all announcements
    if(splitMessage[2] == 'clear'){
        notifyClear(splitMessage, message)
    }
    
    //notify all users of role: NotifyRole of announcements
    if(splitMessage[2] == 'all'){
        notifyAll(splitMessage, message)
    }

}


/** 
 * @alias module:notification~notifyAdd 
 * @param {string[]} splitMessage
 * @param {string} message
*/
function notifyAdd(splitMessage, message){

    //$tu notify add ...
    const addEmbed = new MessageEmbed()
            .setTitle("How to add an announcement")
            .setDescription("Use $tu notify add to add an announcement\n"
            + "**Example: $tu notify add The final is on May 1st!\n**")

    //if user does not provide announcement, send embed above
    if(!splitMessage[3]){ 
        message.channel.send({ embeds: [addEmbed] });
        return;
    }

    
    const announcementObj = {}
    announcementObj.id = announcementObj.length+1;
    let announcement = splitMessage.slice(3).join(" ");
    announcementObj.announcement = announcement;
    announcements.push(announcementObj);

    assignIDs();

    message.channel.send("Announcement successfully added");

}
/** 
 * @alias module:notification~notifyDelete 
 * @param {string[]} splitMessage
 * @param {string} message
*/
function notifyDelete(splitMessage, message){

    //$tu notify delete ...
    const deleteEmbed = new MessageEmbed()
            .setTitle("How to delete an announcement")
            .setDescription("Use $tu notify delete to delete an announcement by id\n"
            + "**Example: $tu notify delete 3\n**"
            + "Announcement 3 will be deleted\n")

    //if user does not provide delete id, send embed above
    if(!splitMessage[3]){ 
        message.channel.send({ embeds: [addEmbed] });
        return;
    }


    //if id given doesn't exist, send embed above
    let id = parseInt(splitMessage[3])
    if(id == NaN || id > announcements.length || id < 1){
        message.channel.send({ embeds: [deleteEmbed] });
        return;
    }

    let deletedAnnouncement = announcements[id-1];
    announcements.splice(id-1, 1);
    assignIDs();

    message.channel.send(`Deleted announcement ${id}: ${deletedAnnouncement.announcement}`)

}
/** 
 * @alias module:notification~notifyClear 
 * @param {string[]} splitMessage
 * @param {string} message
*/
function notifyClear(splitMessage, message){
    announcements = [];
    message.channel.send("Cleared all announcement")
}

/** 
 * @alias module:notification~notifyAll 
 * @param {string[]} splitMessage
 * @param {string} message
*/
function notifyAll(splitMessage, message){

    //grabbing the role
    let roleId = message.guild.roles.cache.find(role => role.name === "NotifyRole");
    console.log()

    let allAnnouncements = "";
    
    for(let i in announcements){      //build description of embed
        allAnnouncements += announcements[i].id + '. ' + announcements[i].announcement
        allAnnouncements += '\n';
    }

    if(announcements.length < 1){
        allAnnouncements += 'There are no announcements!'
    }

    message.channel.send(`Announcements: ${roleId}\n ${allAnnouncements}`)

}

/** @alias module:notification~assignIDs */
function assignIDs(){
    for(let i = 0; i < announcements.length; i++)
        announcements[i].id = i+1;
}
module.exports = {
    notify
};