const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { parseDuration, formatDuration } = require('../utils/duration');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration (e.g. 10m, 1h, 1d). Max 28 days')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const durationInput = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot timeout yourself!', ephemeral: true });
    }
    if (target.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ I cannot timeout myself!', ephemeral: true });
    }

    const ms = parseDuration(durationInput);
    if (!ms) {
      return interaction.reply({
        content: '❌ Invalid duration. Use formats like `30s`, `10m`, `2h`, `1d` (max 28 days).',
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot timeout this user. They may have a higher role than me.', ephemeral: true });
    }
    if (interaction.member.roles.highest.position <= member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot timeout someone with an equal or higher role than you.', ephemeral: true });
    }

    try {
      await member.timeout(ms, `${reason} | Timed out by ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle('⏱️ User Timed Out')
        .addFields(
          { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
          { name: 'Duration', value: formatDuration(ms), inline: true },
          { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to timeout the user.', ephemeral: true });
    }
  },
};
