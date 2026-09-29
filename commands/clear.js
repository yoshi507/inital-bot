const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages from the channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      // Defer because bulk delete can take a moment
      await interaction.deferReply({ ephemeral: true });

      const deleted = await interaction.channel.bulkDelete(amount, true); // true = filter messages older than 14 days

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setDescription(`🧹 Successfully deleted **${deleted.size}** message(s).`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: '❌ Failed to delete messages. Make sure I have the Manage Messages permission and the messages are not older than 14 days.' });
    }
  },
};
