
module.exports = {
	config: {
		name: "goiadmin",
		author: "𝗔𝗺𝗶𝗻𝘂𝗹 𝗦𝗼𝗿𝗱𝗮𝗿",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

onChat: function({ api, event }) {
	if (event.senderID !== "61557991443492") {
		var aid = ["61557991443492"];
		for (const id of aid) {
		if ( Object.keys(event.mentions) == id) {
			var msg = ["If you mention my Owner again, I will punch you! 😾👊🏻" ,"Gf na dile maintion daw ken huh" , "amar owner re ki gf diba je maintion diteso" , "amar owner akhon busy ase maintion dio na 😒"];
			return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
		}
		}}
},
onStart: async function({}) {
	}
};
