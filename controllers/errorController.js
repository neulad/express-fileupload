const httpStatus = require("http-status-codes");

module.exports = {

  pageNotFoundError: (req, res) => {
    res.status(httpStatus.NOT_FOUND)
      .json({error: true, message: "Sorry, there's no such path"});
  },
  
  internalServerError: (error, req, res, next) => {
    console.error(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({error: true, message: error.message});
  }
  
};
