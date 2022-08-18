const router = require("express").Router(),
  filesController = require("../controllers/filesController"),
  usersController = require("../controllers/usersController");
  
router.use(usersController.verify);

router.post("/upload", filesController.create);
router.get("/list", filesController.index);
router.get("/:id", filesController.read);
router.put("/:id/update", filesController.update);
router.get("/:id/download", filesController.download);
router.delete("/:id/delete", filesController.delete);

module.exports = router;
