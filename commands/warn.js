const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { addWarning } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot warn yourself!', ephemeral: true });
    }
    if (target.bot) {
      return interaction.reply({ content: '❌ You cannot warn bots.', ephemeral: true });
    }

    const count = addWarning(interaction.guild.id, target.id, reason, interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('⚠️ User Warned')
      .addFields(
        { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Total Warnings', value: `${count}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Try to DM the user
    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle(`⚠️ You were warned in ${interaction.guild.name}`)
            .addFields(
              { name: 'Reason', value: reason },
              { name: 'Moderator', value: interaction.user.tag }
            )
            .setTimestamp(),
        ],
      });
    } catch {
      // User has DMs closed
    }
  },
};
