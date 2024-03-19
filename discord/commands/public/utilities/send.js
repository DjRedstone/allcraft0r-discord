const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Envoie un message aux personnes de puissances")
        .addStringOption(option =>
            option.setName("text").setDescription("Votre texte").setRequired(true)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        global.adminChannel.send({
            content: `Nouveau message de ${interaction.user.username}: ${interaction.options.getString("text")}`});

        const embed = new EmbedBuilder()
            .setTitle("⚠️ Message de la hiérarchie ⚠️")
            .setDescription("Votre message a été correctement envoyé.")
            .setFooter({
                text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()
            })
            .setThumbnail("https://images.emojiterra.com/twitter/v13.0/512px/2705.png")
            .setColor(Colors.Green);
        await interaction.reply({embeds: [embed], ephemeral: true});
    }
};
