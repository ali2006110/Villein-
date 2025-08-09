const axios = require("axios");

const baseURL = "https://rasin-x-apis.onrender.com/api/rasin";
const teachURL = `${baseURL}/teach`;
const chatURL = `${baseURL}/naru`;
const listURL = `${baseURL}/list?count=true&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;

const conversationMemory = {};
const rasin = ["naru", "bby",  "bot", "hina" , "Hinata" , "xuna"];
const noContentReplies = [
  "Hae babe bolo 🥹🫶🏻",
  "Hae bolo suntechi 😒",
  "Kisse tor 😒",
  "Hae Xuna Bolo🥺"
  "I can’t turn water in wine  🍷 But I can turn you into mine🫶" ,
  "The sunset got mad cause you stole the view..😘" , 
  "হঠাৎ একদিন.....🙃 হারিয়ে যাবো-সব ছেড়ে বহুদূরে.....😅😌 " ,
  "Are you a time traveler? Because I can see you in my future.😌 " , 
  "Do you have a map? I just keep getting lost in your eyes 😌 " ,
  "🍂___তুমি ছন্দ হয়ে থেকে যেও আমার কবিত জুড়েআমি নিখুঁতভাবে খুঁজে নেবো তোমায় শত কাব্যের ও মাঝে!🖤 " ,
  "চাঁদের মত আলো দিলা দিলা না তোমার দেখা আজও আমি তোমার কথা তুমি ভাবো অন্যের কথা "
];

module.exports = {
  config: {
    name: "naru",
    aliases: Naruto,
    version: "2.0.0",
    author: "Naruto Uzumaki",
    countDown: 1,
    role: 0,
    longDescription: { en: "Chat with naru" },
    category: "Simsimi",
    guide: { en: "Say naru <your_message>" }
  },

  onStart: async function ({ api, event, args, messageID, threadID, senderID }) {
    const raw = args.join(" ").trim();
    const key = `${threadID}_${senderID}`;

    if (!raw) {
      const reply = noContentReplies[Math.floor(Math.random() * noContentReplies.length)];
      return api.sendMessage(reply, threadID, (_, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "naru",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    }

    if (raw === "list") {
      try {
        const res = await axios.get(listURL);
        return api.sendMessage(res.data.status === "success" ? res.data.message : "❌", threadID, messageID);
      } catch (err) {
        return api.sendMessage("❌ Couldn't fetch list.", threadID, messageID);
      }
    }

    if (raw === "teach") {
      return api.sendMessage(
        "✏ 𝐓𝐞𝐚𝐜𝐡:\n\n naru teach hi - hey, how are u, hello\n\n𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 Naruto ",
        threadID,
        messageID
      );
    }

    if (raw.startsWith("teach ")) {
      const [phrase, replyText] = raw.substring(6).split("=>").map(p => p.trim());

      if (!phrase || !replyText) {
        return api.sendMessage("Usage: naru teach <text> - <reply1, reply2...>", threadID, messageID);
      }

      const replies = replyText.split(",").map(r => r.trim());
      const teachReq = `${teachURL}?ask=${encodeURIComponent(phrase)}&reply=${encodeURIComponent(replies.join(","))}`;

      try {
        const res = await axios.get(teachReq);
        if (res.data.status === "error") {
          return api.sendMessage(res.data.message || "Failed to teach.", threadID, messageID);
        }

        return api.sendMessage(
          `✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚃𝚎𝚊𝚌𝚑\n\nNᴇᴡ Tᴇᴀᴄʜ 【 ${res.data.new_teach} 】\nNᴇᴡ 𝖱ᴇᴘʟʏ 【 ${res.data.new_reply} 】\n\n${res.data.message2 || ""}`,
          threadID,
          messageID
        );
      } catch (error) {
        if (error.response?.status === 403) {
          const data = error.response.data;
          return api.sendMessage(
            `${data.message || "🚫 18+ content is not allowed!"}\n\n${data.admin_message || ""}`,
            threadID,
            messageID
          );
        }

        console.error("Teach error:", error.message);
        return api.sendMessage("❌ Failed to teach. Try again later.", threadID, messageID);
      }
    }

    try {
      let url = `${chatURL}?msg=${encodeURIComponent(raw)}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;
      if (conversationMemory[key]) {
        url += `&prev=${encodeURIComponent(conversationMemory[key])}`;
      }

      const res = await axios.get(url);
      const reply = res.data.response || "Hi kaman asan ?";
      conversationMemory[key] = reply;

      return api.sendMessage(reply, threadID, (_, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "naru",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    } catch (err) {
      console.error("Naruto Start Error:", err.message);
      return api.sendMessage("❌ Something went wrong.", threadID, messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { body, threadID, senderID, messageID } = event;
    if (!body) return;

    const lower = body.toLowerCase().trim();
    const triggered = Naruto.some(word => lower.startsWith(word));
    if (!triggered) return;

    const raw = lower.replace(new RegExp(`^(${Naruto.join("|")})\\s*`, "i"), "").trim();

    if (!raw) {
      const reply = noContentReplies[Math.floor(Math.random() * noContentReplies.length)];
      return api.sendMessage(reply, threadID, (_, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "naru",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    }

    try {
      if (raw === "list") {
        const res = await axios.get(listURL);
        return api.sendMessage(res.data.status === "success" ? res.data.message : "❌", threadID, messageID);
      }

      if (raw === "teach") {
        return api.sendMessage(
          "✏ 𝐓𝐞𝐚𝐜𝐡:\n\nnaru teach hi - hey, how are u, hello\n\n𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 Naruto",
          threadID,
          messageID
        );
      }

      if (raw.startsWith("teach ")) {
        const [phrase, replyText] = raw.substring(6).split("=>").map(p => p.trim());

        if (!phrase || !replyText) {
          return api.sendMessage("Usage: naru teach <text> - <reply1, reply2...>", threadID, messageID);
        }

        const replies = replyText.split(",").map(r => r.trim());
        const teachReq = `${teachURL}?ask=${encodeURIComponent(phrase)}&reply=${encodeURIComponent(replies.join(","))}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;

        const res = await axios.get(teachReq);

        if (res.data.status === "error") {
          return api.sendMessage(res.data.message || "Failed to teach.", threadID, messageID);
        }

        return api.sendMessage(
          `✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚃𝚎𝚊𝚌𝚑\n\nNᴇᴡ Tᴇᴀᴄʜ 【 ${res.data.new_teach} 】\nNᴇᴡ 𝖱ᴇᴘʟʏ 【 ${res.data.new_reply} 】\n\n${res.data.message2 || ""}`,
          threadID,
          messageID
        );
      }

      const key = `${threadID}_${senderID}`;
      let url = `${chatURL}?msg=${encodeURIComponent(raw)}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;
      if (conversationMemory[key]) {
        url += `&prev=${encodeURIComponent(conversationMemory[key])}`;
      }

      const res = await axios.get(url);
      const botReply = res.data.response || "Hi kaman asan ?";
      conversationMemory[key] = botReply;

      return api.sendMessage(botReply, threadID, (_, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "naru",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    } catch (err) {
      if (err.response?.status === 403) {
        const data = err.response.data;
        return api.sendMessage(
          `${data.message || "🚫 18+ content is not allowed!"}\n\n${data.admin_message || ""}`,
          threadID,
          messageID
        );
      }

      console.error("Error in Jeba Chat:", err.message);
      return api.sendMessage("❌ An error occurred.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event }) {
    const { threadID, senderID, messageID, body } = event;
    const msg = body?.trim();
    if (!msg) return;

    const key = `${threadID}_${senderID}`;

    try {
      let url = `${chatURL}?msg=${encodeURIComponent(msg)}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;
      if (conversationMemory[key]) {
        url += `&prev=${encodeURIComponent(conversationMemory[key])}`;
      }

      const res = await axios.get(url);
      const reply = res.data.response || "Hi kamon asen?";
      conversationMemory[key] = reply;

      return api.sendMessage(reply, threadID, (_, info) => {
        if (info) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "naru",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    } catch (err) {
      console.error("Error in naru Reply:", err.message);
      return api.sendMessage("❌ Error while replying.", threadID, messageID);
    }
  }
};
