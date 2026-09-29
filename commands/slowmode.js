const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode for this channel')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Slowmode duration in seconds (0 to disable, max 21600 = 6 hours)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');

    try {
      await interaction.channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setColor(0x00AAFF)
        .setTitle('🐢 Slowmode Updated')
        .setDescription(
          seconds === 0
            ? 'Slowmode has been **disabled** for this channel.'
            : `Slowmode set to **${seconds} second(s)** for this channel.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to set slowmode. Make sure I have the Manage Channels permission.', ephemeral: true });
    }
  },
};
