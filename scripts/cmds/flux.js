const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "flux",
    version: "1.0.0",
    author: "Rasin",
    countDown: 10,
    role: 2,
    description: {
      en: "Flux",
    },
    category: "FLUX",
    guide: {
      en: "   {pn}flux [prompt]"
    },
  },

  onStart: async function ({ event, args, message, api }) {
    const rasinAPI = "https://rasin-x-apis.onrender.com/api/rasin/flux";

    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("Please provide a prompt!");
      }

      const startTime = Date.now();
      const waitMessage = await message.reply("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞...");
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const apiurl = `${rasinAPI}?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiurl, { responseType: "stream" });

      const time = ((Date.now() - startTime) / 1000).toFixed(2);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.unsend(waitMessage.messageID);

      message.reply({
        body: `✅ 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞`,
        attachment: response.data,
      });
    } catch (e) {
      console.error(e);
      message.reply(`Error: ${e.message || "Failed to generate image. Please try again later."}`);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
