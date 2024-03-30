const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Faux message de ban")
        .addUserOption(option => option
            .setName("user")
            .setDescription("L'utilisateur")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Une raison")
            .setRequired(false)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const target = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "Non spécifiée";
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${target.tag} a été banni`,
                iconURL: target.avatarURL()
            })
            .setDescription(`**Raison :** ${reason}`)
            .setColor(Colors.DarkGrey);
        await interaction.reply({embeds: [embed]});
    }

    // heyhey :p
};
