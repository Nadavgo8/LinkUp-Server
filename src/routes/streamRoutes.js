// import { Router } from "express";
// import type { StreamChat } from "stream-chat";

//  function createStreamRouter(serverClient: StreamChat) {
//   const router = Router();

//   // Issue a user token and upsert basic user fields
//   router.post("/token", async (req, res) => {
//     try {
//       const { user_id, name, image } = req.body || {};
//       if (!user_id) return res.status(400).json({ error: "missing user_id" });
//       await serverClient.upsertUser({ id: user_id, name, image });
//       const token = serverClient.createToken(user_id);
//       res.json({ token });
//     } catch (e: any) {
//       res
//         .status(500)
//         .json({ error: "failed_to_create_token", message: e?.message });
//     }
//   });

//   return router;
// }
// module.exports = { createStreamRouter };

// CommonJS version
function createStreamRouter(serverClient) {
  const express = require("express");
  const router = express.Router();

  // POST /api/stream/token  -> returns { token }
  router.post("/token", async (req, res) => {
    try {
      const { user_id, name, image } = req.body || {};
      if (!user_id) return res.status(400).json({ error: "missing user_id" });

      // make sure the user exists (and set basic fields)
      await serverClient.upsertUser({ id: user_id, name, image });
      const token = serverClient.createToken(user_id);
      res.json({ token });
    } catch (e) {
      console.error("token error:", e);
      res.status(500).json({ error: "failed_to_create_token" });
    }
  });

  return router;
}

module.exports = { createStreamRouter };
