const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors, Events} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist certains mots dans les messages")
        .addSubcommand(cmd => cmd
            .setName("add")
            .setDescription("Ajoute un mot")
            .addStringOption(option => option
                .setName("word")
                .setDescription("Le mot")
                .setRequired(true)))
        .addSubcommand(cmd => cmd
            .setName("list")
            .setDescription("Liste les mots"))
        .addSubcommand(cmd => cmd
            .setName("remove")
            .setDescription("Retire un mot")
            .addStringOption(option => option
                .setName("word")
                .setDescription("Le mot")
                .setRequired(true))),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🚫 Blacklist 🚫")
            .setColor(Colors.Orange);

        switch (interaction.options.getSubcommand()) {

            case "add":
                await global.discord.blacklist.addWord(interaction.options.getString("word").toLowerCase(), interaction.user.id);
                embed.setDescription("✅ Le mot a bien été ajouté !").setColor(Colors.Green);
                break

            case "list":
                const words = await global.discord.blacklist.getWords();
                if (words.length === 0) {
                    embed.setDescription("🚦 Aucun mot n'est présent.")
                } else {
                    embed.setDescription(`🚧 Il y a ${words.length} mot${words.length === 1 ? "" : "s"} :`);
                    for (const data of words) {
                        const { word, user_id, datetime } = data;
                        embed.addFields({
                            name: `⭕️ "${word}"`,
                            value: `> Mot blacklisté par <@${user_id}> <t:${new Date(datetime).getTime() / 1000}:R>`,
                            inline: true
                        });
                    }
                }
                break

            case "remove":
                const res = await global.discord.blacklist.removeWord(interaction.options.getString("word").toLowerCase());
                if (res) {
                    embed.setDescription("✅ Le mot a bien été retiré !").setColor(Colors.Green);
                } else {
                    embed.setDescription("🤔 Le mot n'a pas été trouvé !").setColor(Colors.Red);
                }
                break
        }
        interaction.reply({embeds: [embed], ephemeral: true});
    },
    listeners: [
        {
            event: Events.MessageCreate,
            listener: async message => {
                const isBlacklist = await global.discord.blacklist.isBlacklist(message.content);
                if (isBlacklist) {
                    await message.delete();
                    try {
                        await message.author.send("🚫 Tu as dis quelque chose dans ton message qui a été blacklisté !");
                    } catch (e) {}
                }
            }
        }
    ]
};
