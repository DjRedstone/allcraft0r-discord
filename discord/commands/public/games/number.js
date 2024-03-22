const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors, Events } = require("discord.js");
const { delay } = require("../../../utils");

const MAX = 1_000_000;
const MIN = 100;
const DEFAULT_MAX = 1_000;
let currentMax = null;
let privateNumber = null;
let nbProps = 0;
const MONEY = 100;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("number")
        .setDescription("Démarre une partie de find number")
        .addNumberOption(option => option
            .setName("number")
            .setDescription("Le nombre maximal aléatoire")
            .setRequired(false)
            .setMinValue(MIN)
            .setMaxValue(MAX)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        if (privateNumber === null) {
            const max = interaction.options.getNumber("number") || DEFAULT_MAX;
            privateNumber = Math.floor(Math.random() * max + 1);
            currentMax = max;
            nbProps = 0;
            const embed = new EmbedBuilder()
                .setTitle(`Un nombre aléatoire a été génréré entre 1 et ${max} 🎲`)
                .setDescription("Tout le monde peut chercher mon nombre 👀")
                .setColor(Colors.Red);

            interaction.reply({embeds: [embed]});
        } else {
            await interaction.reply({content: "⚠️ Une partie est déjà en cours !", ephemeral: true});
        }
    },
    listeners: [
        {
            event: Events.MessageCreate,
            listener: async message => {
                if (privateNumber !== null) {
                    const nb = parseInt(message.content);
                    if (!isNaN(nb)) {
                        if (nb < privateNumber) {
                            nbProps += 1;
                            await message.react("🔼");
                            await delay(5000);
                            await message.delete();
                        } else if (nb > privateNumber) {
                            nbProps += 1;
                            await message.react("🔽");
                            await delay(5000);
                            await message.delete();
                        } else {
                            const embed = new EmbedBuilder()
                                .setTitle("Quelqu'un a trouvé le nombre ! 👏")
                                .setDescription(`__${message.author.tag}__ a découvert le nombre \`${privateNumber}\` au bout du **${nbProps + 1}e coup** !`)
                                .setColor(Colors.Yellow);

                            if (Math.ceil(Math.log(currentMax)) >= nbProps) {
                                embed.addFields({
                                    name: "🔸 Top fort !",
                                    value: `> **${message.author.tag}** gagnes __${MONEY} redstones__ !`
                                });
                                await global.discord.money.add(message.author.id, MONEY);
                            }

                            await message.channel.send({
                                embeds: [embed]
                            });

                            privateNumber = null;
                        }
                    }
                }
            }
        }
    ]
};
