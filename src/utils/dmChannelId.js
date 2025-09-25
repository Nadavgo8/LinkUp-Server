// // deterministic, safe channel id for 1:1 dm
function dmChannelId(a, b) {
  const [x, y] = [String(a), String(b)].sort((m, n) => m.localeCompare(n));
  return `dm_${x}_${y}`;
}
module.exports = { dmChannelId };
