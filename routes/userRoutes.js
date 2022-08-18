const router = require("express").Router(),
  usersController = require("../controllers/usersController"),
  { body } = require("express-validator"),
  validator = require("validator");

router.post("/signup", [

  body("id").custom(id => {
  
    return validator.isEmail(id) || validator.isMobilePhone(id, "any", {strictMode: true})
  
  }).withMessage("your id must be an email or a phone number!"),
  
  body("password").isLength({min: 6, max: 40})
    .withMessage("your password must range from 6 to 40!")

], usersController.validate, usersController.create);
router.post("/signin", usersController.authenticate);
router.get("/logout", usersController.logout);
router.get("/info", usersController.info);
router.get("/signin/new_token", usersController.refresh);
router.get("/form", (req, res) => {

  res.sendFile("./public/form.html", { root: "./" });

});

module.exports = router;
