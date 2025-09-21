 // import { Router } from "express";
// import type { StreamChat } from "stream-chat";
// import { dmChannelId } from "../utils/dmChannelId.ts";

// function createChatRouter(serverClient: StreamChat) {
//   const router = Router();

//   // Ensure a deterministic DM exists (idempotent) and ALWAYS send two greetings
//   router.post("/ensure-dm", async (req, res) => {
//     try {
//       const { userA, userB, goal } = req.body as {
//         userA: string;
//         userB: string;
//         goal?: string;
//       };
//       if (!userA || !userB)
//         return res.status(400).json({ error: "userA and userB required" });

//       // Ensure users exist (also set name so UI can display something)
//       await serverClient.upsertUsers([
//         { id: userA, name: userA },
//         { id: userB, name: userB },
//       ]);

//       const channelId = dmChannelId(userA, userB);

//       // Find or create the deterministic channel
//       let [found] = await serverClient.queryChannels(
//         { id: { $eq: channelId } },
//         {},
//         { limit: 1 }
//       );
//       if (!found) {
//         const ch = serverClient.channel("messaging", channelId, {
//           members: [userA, userB],
//           created_by_id: userA,
//         });
//         await ch.create();
//         [found] = await serverClient.queryChannels(
//           { id: { $eq: channelId } },
//           {},
//           { limit: 1 }
//         );
//       }

//       // ALWAYS send the two greeting messages
//       const ch = serverClient.channel("messaging", channelId);
//       const safeGoal = (goal ?? "").toString().trim();
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
//         name: (found.data as any)?.name ?? null,
//       });
//     } catch (e: any) {
//       console.error("ensure-dm error:", e);
//       return res
//         .status(500)
//         .json({ error: "failed_to_ensure_dm", message: e?.message });
//     }
//   });

//   return router;
// }
// module.exports = { createChatRouter };


const express = require("express");
const { dmChannelId } = require("../utils/dmChannelId");

function createChatRouter(serverClient) {
  const router = express.Router();

  // POST /api/chat/ensure-dm  -> ensure single DM and ALWAYS send two greetings
  router.post("/ensure-dm", async (req, res) => {
    try {
      const { userA, userB, goal } = req.body || {};
      if (!userA || !userB) {
        return res.status(400).json({ error: "userA and userB required" });
      }

      // ensure users exist (with basic names so the UI can show something)
      await serverClient.upsertUsers([
        { id: userA, name: userA },
        { id: userB, name: userB },
      ]);

      const id = dmChannelId(userA, userB);

      // find or create deterministic channel
      let [found] = await serverClient.queryChannels(
        { id: { $eq: id } },
        {},
        { limit: 1 }
      );

      if (!found) {
        const ch = serverClient.channel("messaging", id, {
          members: [userA, userB],
          created_by_id: userA, // required for server-side create
          name: `${userA} & ${userB}`, // display name
        });
        await ch.create();
        [found] = await serverClient.queryChannels(
          { id: { $eq: id } },
          {},
          { limit: 1 }
        );
      } else if (!(found.data || {}).name) {
        // backfill name if missing
        await serverClient.partialUpdateChannel(
          { id },
          { set: { name: `${userA} & ${userB}` } }
        );
        [found] = await serverClient.queryChannels(
          { id: { $eq: id } },
          {},
          { limit: 1 }
        );
      }

      // ALWAYS send two greeting messages
      const ch = serverClient.channel("messaging", id);
      const safeGoal = (goal || "").toString().trim();
      const goalPart = safeGoal ? ` on ${safeGoal}` : "";

      await ch.sendMessage({
        user_id: userA,
        text: `Hi ${userB}, I saw we matched${goalPart}, want to talk?`,
      });
      await ch.sendMessage({
        user_id: userB,
        text: `Hi ${userA}, I saw we matched${goalPart}, want to talk?`,
      });

      return res.json({
        cid: found.cid,
        id: found.id,
        type: found.type,
        name: (found.data || {}).name || null,
      });
    } catch (e) {
      console.error("ensure-dm error:", e);
      res.status(500).json({ error: "failed_to_ensure_dm" });
    }
  });

  return router;
}

module.exports = { createChatRouter };
