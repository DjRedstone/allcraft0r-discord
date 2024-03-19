const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Liste des commandos")
        .addStringOption(option => option
            .setName("type")
            .setDescription("Le type des commandes")
            .setRequired(true)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const publicCommands = global.discord.publicCommands;
        const index = global.getFromArray(publicCommands, "folderName", interaction.options.getString("type"));
        if (index !== undefined) {
            const {name, color, commands} = publicCommands[index];
            const embed = new EmbedBuilder()
                .setTitle(`Commandes ${name}`)
                .setColor(color);
            for (const cmd of commands) {
                embed.addFields({
                    name: `◽️ ${cmd.data.name}`,
                    value: `> ${cmd.data.description}`,
                    inline: true
                });
            }
            await interaction.reply({embeds: [embed], ephemeral: true});
        } else {
            throw "Type does not exist.";
        }
    }
};
