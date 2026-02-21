const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Leer credenciales
const credentialsPath = path.join(__dirname, '..', 'credenciales', 'client_secret_543375593384-be02plmbh9mdiplg0cr7af2b15lfvl1b.apps.googleusercontent.com.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.web;

// Cliente OAuth2
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

module.exports = {
  oauth2Client,

  getAuthUrl: () =>
    oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/userinfo.profile']
    }),

  setTokens: (tokens) => oauth2Client.setCredentials(tokens),
  revokeTokens: async () => oauth2Client.revokeCredentials(),

  getUserInfo: async () => {
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const res = await oauth2.userinfo.get();
    return res.data;
  },

  // Listar archivos o carpetas
  listFiles: async (folderId = null) => {
    const query = folderId ? `'${folderId}' in parents` : '';
    const res = await drive.files.list({
      pageSize: 100,
      fields: 'files(id, name, mimeType)',
      q: query
    });
    return res.data.files;
  },

  // Subir archivo
  uploadFile: async (filePath, folderId = null) => {
    const fileName = path.basename(filePath);
    const fileMetadata = { name: fileName };
    if (folderId) fileMetadata.parents = [folderId];

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath)
    };

    const res = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, name'
    });
    return res.data;
  },

  // Descargar archivo
  downloadFile: async (fileId, destPath) => {
    const dest = fs.createWriteStream(destPath);
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
      res.data
        .on('end', () => resolve(destPath))
        .on('error', (err) => reject(err))
        .pipe(dest);
    });
  },

  // Eliminar archivo o carpeta
  deleteFile: async (fileId) => {
    await drive.files.delete({ fileId });
    return { success: true };
  },

  // Crear carpeta
  createFolder: async (name, parentId = null) => {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentId) fileMetadata.parents = [parentId];

    const res = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name'
    });
    return res.data;
  }
};