const router = require("express").Router(),
  errorController = require("../controllers/errorController"),
  userRoutes = require("./userRoutes"),
  fileRoutes = require("./fileRoutes");

router.use("/file", fileRoutes);
router.use("/", userRoutes);

router.use(errorController.pageNotFoundError);

module.exports = router;

