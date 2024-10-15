// backend/routes/index.js
const express = require('express');
const router = express.Router();

const { setTokenCookie } = require('../utils/auth.js');
const { User } = require('../db/models');
const { restoreUser } = require('../../backend/utils/auth.js')

const apiRouter = require('./api');

router.use('/api', apiRouter);



// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/dist")));

   // Serve the frontend's index.html file at all other routes NOT starting with /api
   router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../frontend', 'dist', 'index.html')
    );
  });
}



// GET /api/set-token-cookie
router.get('/api/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});


// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', req.csrfToken());
   res.status(200).json({'XSRF-Token': csrfToken});
  });
}


module.exports = router;