const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("money")
        .setDescription("Affiche son nombre de redstones"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const n = await global.discord.money.get(interaction.user.id);
        await interaction.reply(`<@${interaction.user.id}>, tu as actuellement ${n} ${global.discord.redstone_emoji}`);
    }
};
