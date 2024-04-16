const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

const ORES = [
    { id: "dirt", name: "Dirt" },
    { id: "stone", name: "Pierre" },
    { id: "coal", name: "Charbon" },
    { id: "iron", name: "Fer" },
    { id: "lapis", name: "Lapis Lazuli" },
    { id: "redstone", name: "Redstone" },
    { id: "gold", name: "Or" },
    { id: "emerald", name: "Emeraude" },
    { id: "diamond", name: "Diamand" },
    { id: "quartz", name: "Quartz" },
    { id: "netherite", name: "Netherite" }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Toutes les commandes de notre version de minecraft sur discord")
        .addSubcommand(cmd => cmd
            .setName("profile")
            .setDescription("Affiche ton profile"))
        .addSubcommand(cmd => cmd
            .setName("ores")
            .setDescription("Liste les minerais en ta possession"))
        .addSubcommand(cmd => cmd
            .setName("map")
            .setDescription("Donne des informations par rapport à une carte")
            .addNumberOption(option => option
                .setName("id")
                .setDescription("L'identifiant de la carte")
                .setMinValue(0)
                .setMaxValue(99)
                .setRequired(false))),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({name: "Minecraft", iconURL: "https://minecraft.wiki/images/Minecraft_Twitter_logo.jpg"});
        const userData = await global.discord.minecraft.getUserData(interaction.user.id);
        switch (interaction.options.getSubcommand()) {
            case "profile":
                embed.setTitle(`Profile de __${interaction.user.tag}__`)
                    .addFields(
                        { name: "Rang", value: `> **${userData.rank}**`, inline: true },
                        { name: "Niveau", value: `> **${userData.lvl}**`, inline: true },
                        { name: "XP", value: `> ${userData.xp}`, inline: true }
                    );
                interaction.reply({embeds: [embed]});
                break
            case "ores":
                const userOres = await global.discord.minecraft.getUserOres(interaction.user.id);
                embed.setTitle(`Minerais de __${interaction.user.tag}__`);
                for (const { id, name } of ORES) {
                    embed.addFields({
                        name: userOres[id] !== null ? name : "?".repeat(name.length),
                        value: userOres[id] !== null ? `> ${userOres[id]}` : "> 0",
                        inline: true
                    });
                }
                interaction.reply({embeds: [embed]});
                break
            case "map":
                const mapId = interaction.options.getNumber("id");
                if (mapId === null) {
                    const maps = await global.discord.minecraft.getMaps();
                    embed.setTitle("Les Cartes disponibles à ton niveau");
                    for (const { id, name, description, difficulty, required_lvl } of maps) {
                        if (required_lvl <= userData.lvl) {
                            embed.addFields({
                                name: `\`${id}\` - ${name} (${difficulty})`,
                                value: `> ${description}`,
                                inline: true
                            });
                        }
                    }
                    interaction.reply({embeds: [embed], ephemeral: true});
                } else {
                    const mapIdRes = await global.discord.minecraft.getMap(mapId);
                    if (mapIdRes === null) {
                        interaction.reply({content: `La carte \`${mapId}\` n'existe pas !`, ephemeral: true})
                    } else {
                        if (mapIdRes.required_lvl <= userData.lvl) {
                            embed.setTitle(`Données de la carte __${mapIdRes.name}__ (${mapIdRes.difficulty})`);
                            embed.setDescription(`> ${mapIdRes.description}\n### Probabilitées des minerais :`);
                            for (const { id, name } of ORES) {
                                if (mapIdRes[id] !== null) {
                                    embed.addFields({
                                        name: name,
                                        value: `> ${mapIdRes[id] * 100}%`,
                                        inline: true
                                    });
                                }
                            }
                            interaction.reply({embeds: [embed], ephemeral: true});
                        } else {
                            interaction.reply({
                                content: `Tu n'as pas le niveau requis pour cette carte ! (${userData.lvl}/${mapIdRes.required_lvl})`,
                                ephemeral: true
                            });
                        }
                    }
                }
                break
        }
    }
};
