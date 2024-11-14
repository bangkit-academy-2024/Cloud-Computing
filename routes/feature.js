const express = require('express');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 *
 * /api/notif:
 *   post:
 *     tags:
 *       - Feuture
 *     summary: Whatsapp Notif
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomor:
 *                 type: String
 *                 example: "ex. 62895411954396"
 *               pesan:
 *                 type: String
 *                 example: "Detail penyakit anda cacar air.."
 *     responses:
 *       201:
 *         description: "Success"
 *       500:
 *         description: "Gagal mengirim notif"
 *
 * /api/ai:
 *   post:
 *     tags:
 *       - Feuture
 *     summary: Chatgpt Penyakit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pesan:
 *                 type: String
 *                 example: "Apa obat yang cocok untuk saya"
 *               penyakit:
 *                 type: String
 *                 example: "Cacar air"
 *     responses:
 *       201:
 *         description: "true"
 *       500:
 *         description: "false"
 */

router.post('/notif', verifyToken, async (req, res) => {
  const { nomor, pesan } = req.body;

  const PHONE_CC = await (await fetch('https://raw.githubusercontent.com/clicknetcafe/Databasee/refs/heads/master/data/countryphonecode.json')).json();
  const phoneNumber = nomor.replace(/[^0-9]/g, '');

  if (!Object.keys(PHONE_CC).some((v) => phoneNumber.startsWith(v))) {
    return res.status(400).json({
      status: false,
      message: "Start with your country's WhatsApp code, Example : 62xxx",
    });
  }

  try {
    const url = 'https://bot.affidev.com/api/send-text?apikey=akusayangkamu';
    const response = await axios.post(url, {
      jid: `${phoneNumber}@s.whatsapp.net`,
      message: pesan,
    });

    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({
      status: false,
      message: 'Gagal mengirim notif',
    });
  }
});

router.post('/ai', verifyToken, async (req, res) => {
  const { pesan, penyakit } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.substring('Bearer '.length);

  async function chatgpt(userid, text, model = 'gpt-4o-mini') {
    try {
      const response = await axios.post('https://luminai.my.id/v2', {
        text,
        userId: userid,
        model,
      });

      return response.data.reply.reply;
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan dalam mendapatkan respons.',
      });
    }
  }

  try {
    const userId = token;
    let userText = pesan;
    userText += `\n\nPerlu diingat penyakit kult saya sekarang adalah ${penyakit}`;

    const result = await chatgpt(userId, userText);
    let output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
    output = output.replace(/\\n/g, '\n');
    return res.status(201).json({
      status: true,
      message: output.replace(/\*\*/g, '*'),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan dalam mendapatkan respons.',
    });
  }
});

module.exports = router;
