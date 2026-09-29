const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
        .setMaxLength(2000))
    .addBooleanOption(option =>
      option.setName('embed')
        .setDescription('Send as an embed? (default: false)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const asEmbed = interaction.options.getBoolean('embed') || false;

    try {
      // Acknowledge the command privately
      await interaction.reply({ content: '✅ Message sent!', ephemeral: true });

      if (asEmbed) {
        const embed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setDescription(message)
          .setFooter({ text: `Requested by ${interaction.user.tag}` })
          .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
      } else {
        await interaction.channel.send({ content: message });
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: '❌ Failed to send the message.', ephemeral: true });
    }
  },
};
