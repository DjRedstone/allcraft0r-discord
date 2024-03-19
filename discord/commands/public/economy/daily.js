const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

const MONEY = 250;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Récupère sa redstone quotidienne"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const id = interaction.user.id;
        const hasDaily = await global.discord.db.hasDaily(id);
        if (hasDaily) {
            interaction.reply({
                content: "Tu as déjà récupéré ta redstone quotidienne.",
                ephemeral: true
            });
        } else {
            await global.discord.db.updateDaily(id);
            await global.discord.money.add(id, MONEY);
            interaction.reply({
                content: `<@${id}>, tu as reçu ${MONEY} ${global.discord.redstone_emoji}`
            });
        }
    }
};
