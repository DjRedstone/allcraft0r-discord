const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Toutes les commandes de notre version de minecraft sur discord")
        .addSubcommand(cmd => cmd
            .setName("profile")
            .setDescription("Affiche ton profile"))
        .addSubcommand(cmd => cmd
            .setName("ores")
            .setDescription("Liste les minerais en ta possession")),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: "Minecraft", iconURL: "https://minecraft.wiki/images/Minecraft_Twitter_logo.jpg"})
        switch (interaction.options.getSubcommand()) {
            case "profile":
                const data = await global.discord.minecraft.getUserData(interaction.user.id);
                embed.setTitle(`Profile de __${interaction.user.tag}__`)
                    .addFields(
                        { name: "Rang", value: `> **${data.rank}**`, inline: true },
                        { name: "Niveau", value: `> **${data.lvl}**`, inline: true },
                        { name: "XP", value: `> ${data.xp}`, inline: true }
                    );
                interaction.reply({embeds: [embed]});
                break
            case "ores":
                const ores = await global.discord.minecraft.getUserOres(interaction.user.id);
                embed.setTitle(`Minerais de __${interaction.user.tag}__`)
                    .addFields(
                        { name: "Dirt", value: `> ${ores.dirt}`, inline: true },
                        { name: "Pierre", value: `> ${ores.stone}`, inline: true },
                        { name: ores.coal !== null ? "Charbon" : "???????", value: ores.coal !== null ? `> ${ores.coal}` : "> 0", inline: true },
                        { name: ores.iron !== null ? "Fer" : "???", value: ores.iron !== null ? `> ${ores.iron}` : "> 0", inline: true },
                        { name: ores.lapis !== null ? "Lapis Lazuli" : "????? ??????", value: ores.lapis !== null ? `> ${ores.lapis}` : "> 0", inline: true },
                        { name: ores.redstone !== null ? "Redstone" : "????????", value: ores.redstone !== null ? `> ${ores.redstone}` : "> 0", inline: true },
                        { name: ores.gold !== null ? "Or" : "??", value: ores.gold !== null ? `> ${ores.gold}` : "> 0", inline: true },
                        { name: ores.emerald !== null ? "Emeraude" : "????????", value: ores.emerald !== null ? `> ${ores.emerald}` : "> 0", inline: true },
                        { name: ores.diamond !== null ? "Diamand" : "???????", value: ores.diamond !== null ? `> ${ores.diamond}` : "> 0", inline: true },
                        { name: ores.quartz !== null ? "Quartz" : "??????", value: ores.quartz !== null ? `> ${ores.quartz}` : "> 0", inline: true },
                        { name: ores.netherite !== null ? "Netherite" : "????????", value: ores.netherite !== null ? `> ${ores.netherite}` : "> 0", inline: true }
                    );
                interaction.reply({embeds: [embed]});
                break
        }
    }
};
