const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

const emojis = ["🏆", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dashboard")
        .setDescription("Affiche les 10 membres ayant le plus de redstone"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {

        const leaderboard = await global.discord.db.getLeaderboard();

        let description = "";
        for (let i = 0; i < Math.min(10, leaderboard.length); i++) {
            const { uuid, money } = leaderboard[i];
            if (i < 2) {
                description += "#".repeat(i + 1)
            } else {
                description += "###";
            }
            description += ` ${emojis[i]} <@${uuid}> - **${money}**\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Dashboard de redstone ${global.discord.redstone_emoji}`)
            .setDescription(description)
            .setColor(Colors.Red);

        interaction.reply({
            embeds: [embed]
        });
    }
};
