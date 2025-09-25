// // services/chatService.js
// const { dmChannelId } = require("../utils/dmChannelId");

// /**
//  * Ensures a deterministic DM channel between two users and sends two greetings.
//  * Returns { cid, id, type, name }.
//  */
// async function ensureDm(serverClient, userA, userB, goal) {
//   if (!serverClient) throw new Error("serverClient missing");
//   if (!userA || !userB) throw new Error("userA and userB required");

//   // Make sure users exist (minimal data so UI can render names)
//   await serverClient.upsertUsers([
//     { id: userA, name: userA },
//     { id: userB, name: userB },
//   ]);

//   const id = dmChannelId(userA, userB);

//   // Find or create the channel
//   let [found] = await serverClient.queryChannels(
//     { id: { $eq: id } },
//     {},
//     { limit: 1 }
//   );

//   if (!found) {
//     const ch = serverClient.channel("messaging", id, {
//       members: [userA, userB],
//       created_by_id: userA,
//       name: `${userA} & ${userB}`,
//     });
//     await ch.create();
//     [found] = await serverClient.queryChannels(
//       { id: { $eq: id } },
//       {},
//       { limit: 1 }
//     );
//   } else if (!(found.data || {}).name) {
//     await serverClient.partialUpdateChannel(
//       { id },
//       { set: { name: `${userA} & ${userB}` } }
//     );
//     [found] = await serverClient.queryChannels(
//       { id: { $eq: id } },
//       {},
//       { limit: 1 }
//     );
//   }

//   // Always send two greetings
//   const ch = serverClient.channel("messaging", id);
//   const safeGoal = (goal || "").toString().trim();
//   const goalPart = safeGoal ? ` on ${safeGoal}` : "";

//   await ch.sendMessage({
//     user_id: userA,
//     text: `Hi ${userB}, I saw we matched${goalPart}, want to talk?`,
//   });
//   await ch.sendMessage({
//     user_id: userB,
//     text: `Hi ${userA}, I saw we matched${goalPart}, want to talk?`,
//   });

//   return {
//     cid: found.cid,
//     id: found.id,
//     type: found.type,
//     name: (found.data || {}).name || null,
//   };
// }

// module.exports = { ensureDm };

// // services/chatService.js (or inside ensureDm)
// const { dmChannelId } = require("../utils/dmChannelId");
// const User = require("../models/User");

// async function ensureDm(serverClient, userA, userB, goal) {
//   const me   = await User.findById(userA).select("fullName photoUrl").lean();
//   const peer = await User.findById(userB).select("fullName photoUrl").lean();

//   const meName   = me?.fullName   || userA;
//   const peerName = peer?.fullName || userB;

//   await serverClient.upsertUsers([
//     { id: userA, name: meName,   image: me?.photoUrl   },
//     { id: userB, name: peerName, image: peer?.photoUrl },
//   ]);

//   const id = dmChannelId(userA, userB);

//   // No channel name here — we’ll compute per-viewer title on the client
//   let [found] = await serverClient.queryChannels({ id: { $eq: id } }, {}, { limit: 1 });
//   if (!found) {
//     const ch = serverClient.channel("messaging", id, {
//       members: [userA, userB],
//       created_by_id: userA,
//       // name: undefined  // <- omit
//     });
//     await ch.create();
//     [found] = await serverClient.queryChannels({ id: { $eq: id } }, {}, { limit: 1 });
//   }

//   // Always send two greetings, using real names
//   const ch = serverClient.channel("messaging", id);
//   const goalPart = (goal && `${String(goal).trim()}`) ? ` on ${goal}` : "";

//   await ch.sendMessage({ user_id: userA, text: `Hi ${peerName}, I saw we matched${goalPart}, want to talk?` });
//   await ch.sendMessage({ user_id: userB, text: `Hi ${meName}, I saw we matched${goalPart}, want to talk?` });

//   return { cid: found.cid, id: found.id, type: found.type };
// }

// module.exports = { ensureDm };

const User = require("../models/User");
const { dmChannelId, dmDisplayName } = require("../utils/dmChannelId");

/**
 * Ensure a 1:1 DM with deterministic id and a nice channel.data.name like "Alice & Bob".
 * Also upserts Stream users with real names/photos and sends greetings (once per ensure call).
 */
async function ensureDm(serverClient, userA, userB, goal) {
  if (!serverClient) throw new Error("serverClient missing");
  if (!userA || !userB) throw new Error("userA and userB required");
  if (userA === userB) throw new Error("Cannot DM yourself");

  // Pull real names/photos from your DB
  const [a, b] = await Promise.all([
    User.findById(userA).select("fullName photoUrl").lean(),
    User.findById(userB).select("fullName photoUrl").lean(),
  ]);



  // Upsert users in Stream so UI shows proper name/avatar
  await serverClient.upsertUsers([
    { id: String(userA), name: aName, image: a?.photoUrl },
    { id: String(userB), name: bName, image: b?.photoUrl },
  ]);

  const id = dmChannelId(userA, userB);

  // Find or create deterministic channel with the pretty name
  let [found] = await serverClient.queryChannels(
    { id: { $eq: id } },
    {},
    { limit: 1 }
  );

  if (!found) {
    const ch = serverClient.channel("messaging", id, {
      members: [String(userA), String(userB)],
      created_by_id: String(userA),
      //   name: displayName, // <-- sets "Alice & Bob"
    });
    await ch.create();
    [found] = await serverClient.queryChannels(
      { id: { $eq: id } },
      {},
      { limit: 1 }
    );
  } else {
    // Keep the display name in sync if someone renamed
    const currentName = (found.data || {}).name || "";
    if (currentName !== displayName) {
      await serverClient.partialUpdateChannel(
        { id }
        // { set: { name: displayName } }
      );
      [found] = await serverClient.queryChannels(
        { id: { $eq: id } },
        {},
        { limit: 1 }
      );
    }
  }

  // Optional greetings (safe but idempotent-ish per call)
  const ch = serverClient.channel("messaging", id);
  const safeGoal = (goal || "").toString().trim();
  const goalPart = safeGoal ? ` on ${safeGoal}` : "";
  await ch.sendMessage({
    user_id: String(userA),
    text: `Hi ${bName}, we matched${goalPart}!`,
  });
  await ch.sendMessage({
    user_id: String(userB),
    text: `Hi ${aName}, we matched${goalPart}!`,
  });

  return {
    cid: found.cid,
    id: found.id,
    type: found.type,
    name: (found.data || {}).name || null,
  };
}

module.exports = { ensureDm };
