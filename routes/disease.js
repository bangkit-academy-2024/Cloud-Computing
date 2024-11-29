const express = require('express');
const axios = require('axios');

const router = express.Router();

let data = { penyakit: {} };
axios.get('https://raw.githubusercontent.com/epialert/cdn/refs/heads/master/diseases.json')
    .then(response => {
        data = response.data; // Simpan data ke dalam variabel data
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

/**
 * @swagger
 * components:
 *   schemas:
 *     Disease:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         penjelasan:
 *           type: string
 *           example: "Eczema, atau dikenal sebagai dermatitis atopik, adalah penyakit kulit kronis yang menyebabkan peradangan, gatal, kemerahan, dan kulit kering."
 *         pertanyaan:
 *           type: string
 *           example: "Apa yang ingin Anda ketahui tentang eczema? (1: Gejala, 2: Penyebab, 3: Cara Pengobatan)"
 *         jawaban:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "1"
 *               kategori:
 *                 type: string
 *                 example: "Gejala"
 *               text:
 *                 type: string
 *                 example: "Gejala eczema meliputi kulit kering, merah, dan sangat gatal."
 *
 * /api/penyakit:
 *   get:
 *     tags:
 *       - Disease
 *     summary: Mendapatkan semua penyakit
 *     responses:
 *       200:
 *         description: "Daftar penyakit"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 penyakit:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disease'
 *       404:
 *         description: "Penyakit tidak ditemukan"
 *
 * /api/penyakit/{namaPenyakit}/penjelasan:
 *   get:
 *     tags:
 *       - Disease
 *     summary: Mendapatkan penjelasan tentang penyakit tertentu
 *     parameters:
 *       - name: namaPenyakit
 *         in: path
 *         required: true
 *         description: Nama penyakit yang ingin dicari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Penjelasan penyakit"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 penjelasan:
 *                   type: string
 *       404:
 *         description: "Penyakit tidak ditemukan"
 *
 * /api/penyakit/{namaPenyakit}/pertanyaan:
 *   get:
 *     tags:
 *       - Disease
 *     summary: Mendapatkan pertanyaan tentang penyakit tertentu
 *     parameters:
 *       - name: namaPenyakit
 *         in: path
 *         required: true
 *         description: Nama penyakit yang ingin dicari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Pertanyaan tentang penyakit"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pertanyaan:
 *                   type: string
 *       404:
 *         description: "Penyakit tidak ditemukan"
 *
 * /api/penyakit/{namaPenyakit}/jawaban/{idJawaban}:
 *   get:
 *     tags:
 *       - Disease
 *     summary: Mendapatkan jawaban berdasarkan ID untuk penyakit tertentu
 *     parameters:
 *       - name: namaPenyakit
 *         in: path
 *         required: true
 *         description: Nama penyakit yang ingin dicari
 *         schema:
 *           type: string
 *       - name: idJawaban
 *         in: path
 *         required: true
 *         description: ID jawaban yang ingin dicari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Jawaban tentang penyakit"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 kategori:
 *                   type: string
 *                   example: "Gejala"
 *                 text:
 *                   type: string
 *                   example: "Gejala eczema meliputi kulit kering, merah, dan sangat gatal."
 *       404:
 *         description: "Jawaban atau penyakit tidak ditemukan"
 */

router.get('/penyakit', async (req, res) => {
    res.status(200).json(data);
});

router.get('/penyakit/:namaPenyakit/penjelasan', (req, res) => {
    const namaPenyakit = req.params.namaPenyakit.toLowerCase();
    const penyakit = data.penyakit[namaPenyakit];

    if (penyakit) {
        res.json({ penjelasan: penyakit.penjelasan });
    } else {
        res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    }
});

router.get('/penyakit/:namaPenyakit/pertanyaan', (req, res) => {
    const namaPenyakit = req.params.namaPenyakit.toLowerCase();
    const penyakit = data.penyakit[namaPenyakit];

    if (penyakit) {
        res.json({ pertanyaan: penyakit.pertanyaan });
    } else {
        res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    }
});

router.get('/penyakit/:namaPenyakit/jawaban/:idJawaban', (req, res) => {
    const namaPenyakit = req.params.namaPenyakit.toLowerCase();
    const idJawaban = req.params.idJawaban
    const penyakit = data.penyakit[namaPenyakit];

    if (penyakit) {
        const jawaban = penyakit.jawaban.find(j => j.id === idJawaban);
        if (jawaban) {
            res.json(jawaban);
        } else {
            res.status(404).json({ message: 'Jawaban tidak ditemukan' });
        }
    } else {
        res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    }
});

module.exports = router;