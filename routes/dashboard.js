const express = require('express');
const router = express.Router();
const { verificarSesion } = require('../middlewares/auth');
const { setTokens, getUserInfo } = require('../services/googleDrive');

// Dashboard protegido
router.get('/', verificarSesion, async (req, res) => {
  try {
    setTokens(req.session.tokens);

    const user = await getUserInfo();

    res.send(`
      <h2>👤 Dashboard</h2>
      <p>Nombre: ${user.name}</p>
      <p>Email: ${user.email}</p>
      <img src="${user.picture}" alt="Avatar" width="80" style="border-radius:50%">
      <p><a href="/drive/files">Ver archivos en Drive</a></p>
      <p><a href="/auth/logout">Cerrar sesión</a></p>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener info del usuario');
  }
});

module.exports = router;