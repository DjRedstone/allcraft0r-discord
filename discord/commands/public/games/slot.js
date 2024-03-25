const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");

const DEFAULT = 50;
const MIN = 75;
const MAX = 125;

function random() {
    return Math.random() * (10) + 1 < 4;
}

/** @param {ChatInputCommandInteraction} interaction */
async function execute(interaction) {
    const userId = interaction.user.id;
    const userMoney = await global.discord.money.get(userId);

    if (userMoney < DEFAULT) {
        await interaction.reply({
            content: `Tu n'as pas assez de redstones ${global.discord.redstone_emoji} !`,
            ephemeral: true
        });
    } else {
        if (random()) {
            const gain = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
            await global.discord.money.add(userId, gain);

            const embed = new EmbedBuilder()
                .setTitle("🍀 Machine à sous 🍀")
                .setDescription(`Bravo ${interaction.user.tag} ! Tu as gagné une mise est de **${gain}** ${global.discord.redstone_emoji} !`)
                .setColor(Colors.Green);

            const replay = new ButtonBuilder()
                .setCustomId("slot-replay")
                .setLabel("♻️ Rejouer")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(replay);

            interaction.reply({
                embeds: [embed],
                components: [row]
            });
        } else {
            await global.discord.money.remove(userId, DEFAULT);

            const embed = new EmbedBuilder()
                .setTitle("🍀 Machine à sous 🍀")
                .setDescription(`Dommage ${interaction.user.tag} ! Tu viens de perdre la mise de **${DEFAULT}** ${global.discord.redstone_emoji} !`)
                .setColor(Colors.Red);

            const replay = new ButtonBuilder()
                .setCustomId("slot-replay")
                .setLabel("♻️ Rejouer")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(replay);

            interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slot")
        .setDescription("Démarre une partie de machine à sous"),

    execute,
    listeners: [
        {
            event: Events.InteractionCreate,
            /** @param interaction {ChatInputCommandInteraction} */
            listener: async interaction => {
                if (interaction.isButton() && interaction.customId === "slot-replay") {
                    await execute(interaction);
                }
            }
        }
    ]
};
