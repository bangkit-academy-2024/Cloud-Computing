const express = require('express');

const router = express.Router();

/**
 * @swagger
 *
 * /api/notif:
 *   get:
 *     tags:
 *       - Feuture
 *     summary: Whatsapp Notif (Coming Soon)
 *     responses:
 *       200:
 *         description: ok
 *
 */

router.get('/notif', async (req, res) => {
  res.status(200).json({
    author: 'affidev',
    message: 'Ooopss, Coming Soon...',
  });
});

module.exports = router;
