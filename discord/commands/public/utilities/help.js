const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const aroundChar = {}

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
                let optionsTxt = "";
                for (const option of cmd.data.options) {
                    const { type, name, required } = option;
                    optionsTxt += required ? "<" : "(<";
                    if (type in aroundChar) {
                        optionsTxt += aroundChar[type];
                    }
                    optionsTxt += name;
                    optionsTxt += required ? ">" : ">)";
                    optionsTxt += " ";
                }
                embed.addFields({
                    name: `◽️ ${cmd.data.name} ${optionsTxt}`,
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
