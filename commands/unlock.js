const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock the current channel (allow @everyone to send messages again)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildAnnouncement) {
      return interaction.reply({ content: '❌ This command can only be used in text channels.', ephemeral: true });
    }

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null, // reset to default
      });

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🔓 Channel Unlocked')
        .setDescription(`This channel has been unlocked by ${interaction.user}.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to unlock the channel. Make sure I have the Manage Channels permission.', ephemeral: true });
    }
  },
};
