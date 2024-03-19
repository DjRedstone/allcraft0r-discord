const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Lance une balle de ping pong, voit en combien de temps je la renvoie"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🏓 Pong !")
            .setDescription(`⏳ ${new Date() - interaction.createdTimestamp}ms`)
            .setColor(Colors.Orange);
        await interaction.reply({embeds: [embed], ephemeral: true});
    }
};
