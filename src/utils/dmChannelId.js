// // deterministic, safe channel id for 1:1 dm
function dmChannelId(a, b) {
  const [lo, hi] = [String(a), String(b)].sort();
  return `dm_${lo}__${hi}`;
}
module.exports = { dmChannelId };
