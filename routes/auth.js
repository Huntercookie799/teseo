const express = require('express');
const router = express.Router();
const { oauth2Client, setTokens, revokeTokens } = require('../services/googleDrive');

// Login Google
router.get('/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive']
  });
  res.redirect(authUrl);
});

// Callback Google
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    setTokens(tokens);
    req.session.tokens = tokens;
    res.redirect('/'); // Redirige al home seguro
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error en autenticación');
  }
});

// Logout
router.get('/logout', async (req, res) => {
  try {
    if (req.session.tokens) {
      setTokens(req.session.tokens);
      await revokeTokens();
    }
    req.session.destroy(() => {
      res.send(`
        <h2>❌ Has cerrado sesión</h2>
        <p><a href="/">Volver al inicio</a></p>
      `);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cerrar sesión');
  }
});

module.exports = router;