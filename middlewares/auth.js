function verificarSesion(req, res, next) {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
}

module.exports = { verificarSesion };