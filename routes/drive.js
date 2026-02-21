const express = require('express');
const router = express.Router();
const { verificarSesion } = require('../middlewares/auth');
const { oauth2Client, setTokens, listFiles } = require('../services/googleDrive');

router.get('/files', verificarSesion, async (req, res) => {
  try {
    setTokens(req.session.tokens);
    const files = await listFiles();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
});

module.exports = router;