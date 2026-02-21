const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.tokens) {
    return res.redirect('/auth/google');
  }

  res.send(`
    <h2>✅ Estás logeado en Google Drive</h2>
    <p><a href="/drive/files">Ver archivos en Drive</a></p>
    <p><a href="/auth/logout">Cerrar sesión</a></p>
  `);
});

router.get('/estado', (req, res) => {
  res.json({
    autenticado: !!req.session.tokens
  });
});

module.exports = router;