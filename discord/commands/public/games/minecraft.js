const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Toutes les commandes de notre version de minecraft sur discord")
        .addSubcommand(cmd => cmd
            .setName("profile")
            .setDescription("Affiche ton profile")),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "profile":
                const data = await global.discord.minecraft.getUserData(interaction.user.id);
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setAuthor({ name: "Minecraft", iconURL: "https://minecraft.wiki/images/Minecraft_Twitter_logo.jpg" })
                    .setTitle(`Profile de __${interaction.user.tag}__`)
                    .addFields(
                        { name: "Rang", value: data.rank },
                        { name: "Niveau", value: String(data.lvl) },
                        { name: "XP", value: String(data.xp) }
                    );
                interaction.reply({embeds: [embed]});
                break
        }
    }
};
