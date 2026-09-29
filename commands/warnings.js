const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarnings } = require('../utils/warnings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warnings = getWarnings(interaction.guild.id, target.id);

    if (warnings.length === 0) {
      return interaction.reply({
        content: `✅ **${target.tag}** has no warnings.`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle(`⚠️ Warnings for ${target.tag}`)
      .setDescription(`Total: **${warnings.length}** warning(s)`)
      .setTimestamp();

    // Show up to 10 most recent warnings
    const recent = warnings.slice(-10).reverse();
    recent.forEach((w, i) => {
      const date = new Date(w.timestamp).toLocaleString();
      embed.addFields({
        name: `#${warnings.length - i} • ${date}`,
        value: `**Reason:** ${w.reason}\n**Moderator:** <@${w.moderatorId}>`,
      });
    });

    if (warnings.length > 10) {
      embed.setFooter({ text: `Showing 10 most recent of ${warnings.length} total warnings` });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
