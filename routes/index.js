const router = require("express").Router();
const mainBL = require('../models/mainBL');

router.get('/', async (req, res, next) => {
  const resp = await mainBL.run();
  res.status(resp.status).json(resp.data);
});


module.exports = router;
