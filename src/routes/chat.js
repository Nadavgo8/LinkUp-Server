// //not connected to mongoDB and dups chat on creation
// const express = require("express");
// const { dmChannelId } = require("../utils/dmChannelId");

// function createChatRouter(serverClient) {
//   const router = express.Router();

//   // POST /api/chat/ensure-dm  -> ensure single DM and ALWAYS send two greetings
//   router.post("/ensure-dm", async (req, res) => {
//     try {
//       const { userA, userB, goal } = req.body || {};
//       if (!userA || !userB) {
//         return res.status(400).json({ error: "userA and userB required" });
//       }

//       // ensure users exist (with basic names so the UI can show something)
//       await serverClient.upsertUsers([
//         { id: userA, name: userA },
//         { id: userB, name: userB },
//       ]);

//       const id = dmChannelId(userA, userB);

//       // find or create deterministic channel
//       let [found] = await serverClient.queryChannels(
//         { id: { $eq: id } },
//         {},
//         { limit: 1 }
//       );

//       if (!found) {
//         const ch = serverClient.channel("messaging", id, {
//           members: [userA, userB],
//           created_by_id: userA, // required for server-side create
//           name: `${userA} & ${userB}`, // display name
//         });
//         await ch.create();
//         [found] = await serverClient.queryChannels(
//           { id: { $eq: id } },
//           {},
//           { limit: 1 }
//         );
//       } else if (!(found.data || {}).name) {
//         // backfill name if missing
//         await serverClient.partialUpdateChannel(
//           { id },
//           { set: { name: `${userA} & ${userB}` } }
//         );
//         [found] = await serverClient.queryChannels(
//           { id: { $eq: id } },
//           {},
//           { limit: 1 }
//         );
//       }

//       // ALWAYS send two greeting messages
//       const ch = serverClient.channel("messaging", id);
//       const safeGoal = (goal || "").toString().trim();
//       const goalPart = safeGoal ? ` on ${safeGoal}` : "";

//       await ch.sendMessage({
//         user_id: userA,
//         text: `Hi ${userB}, I saw we matched${goalPart}, want to talk?`,
//       });
//       await ch.sendMessage({
//         user_id: userB,
//         text: `Hi ${userA}, I saw we matched${goalPart}, want to talk?`,
//       });

//       return res.json({
//         cid: found.cid,
//         id: found.id,
//         type: found.type,
//         name: (found.data || {}).name || null,
//       });
//     } catch (e) {
//       console.error("ensure-dm error:", e);
//       res.status(500).json({ error: "failed_to_ensure_dm" });
//     }
//   });

//   return router;
// }

// module.exports = { createChatRouter };

// const express = require("express");
// const { ensureDm } = require("../services/chatService");

// function createChatRouter(serverClient) {
//   const router = express.Router();

//   router.post("/ensure-dm", async (req, res) => {
//     try {
//       const { userA, userB, goal } = req.body || {};
//       if (!userA || !userB)
//         return res.status(400).json({ error: "userA and userB required" });

//       const result = await ensureDm(serverClient, userA, userB, goal);
//       res.json(result);
//     } catch (e) {
//       console.error("ensure-dm error:", e);
//       res.status(500).json({ error: "failed_to_ensure_dm" });
//     }
//   });

//   return router;
// }

// module.exports = { createChatRouter };

const express = require("express");
const { ensureDm } = require("../services/chatService");

function createChatRouter(serverClient) {
  const router = express.Router();

  router.post("/ensure-dm", async (req, res) => {
    try {
      const { userA, userB, goal } = req.body || {};
      if (!userA || !userB)
        return res.status(400).json({ error: "userA and userB required" });

      const result = await ensureDm(serverClient, userA, userB, goal);
      res.json(result); // { id, cid, type, name }
    } catch (e) {
      console.error("ensure-dm error:", e);
      res.status(500).json({ error: "failed_to_ensure_dm" });
    }
  });

  return router;
}

module.exports = { createChatRouter };
