const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("text")
        .setDescription("Message personnalisé")
        .addStringOption(option => option
            .setName("text")
            .setDescription("Le texte")
            .setRequired(true))
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Un channel spécifique")
            .setRequired(false)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("⚠️ Message de la hiérarchie ⚠️")
            .setDescription(interaction.options.getString("text"))
            .setColor(Colors.Yellow)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL()
            });
        const channel = interaction.options.getChannel("channel");
        if (channel) {
            await channel.send({embeds: [embed]});
            await interaction.reply({content: "Le message a été envoyé !", ephemeral: true});
        } else {
            await interaction.reply({embeds: [embed]});
        }
    }
};
