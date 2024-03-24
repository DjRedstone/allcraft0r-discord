const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock un channel")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Le channel cible")
            .setRequired(true))
        .addStringOption(option => option
                .setName("reason")
                .setDescription("Une raison")
                .setRequired(false)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const target = interaction.options.getChannel("channel");
        const permissions = target.permissionsFor(target.guild.roles.everyone).toArray();

        if (!permissions.includes("SendMessages")) {
            target.permissionOverwrites.edit(target.guild.roles.everyone, { SendMessages: true });
            await interaction.reply({content: "Le channel a été unlock !", ephemeral: true});
            const embed = new EmbedBuilder()
                .setTitle("Ce channel a été unlock ✅")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                })
                .setColor(Colors.Green);
            const reason = interaction.options.getString("reason");
            if (reason) embed.setDescription(reason);
            await target.send({embeds: [embed]});
        } else {
            await interaction.reply({content: "Le channel est déjà unlock !", ephemeral: true});
        }
    }
};
