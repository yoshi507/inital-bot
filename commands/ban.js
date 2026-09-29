const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot ban yourself!', ephemeral: true });
    }
    if (target.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ I cannot ban myself!', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (member) {
      if (!member.bannable) {
        return interaction.reply({ content: '❌ I cannot ban this user. They may have a higher role than me.', ephemeral: true });
      }
      if (interaction.member.roles.highest.position <= member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) {
        return interaction.reply({ content: '❌ You cannot ban someone with an equal or higher role than you.', ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(target, { reason: `${reason} | Banned by ${interaction.user.tag}` });

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🔨 User Banned')
        .addFields(
          { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
          { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to ban the user.', ephemeral: true });
    }
  },
};
