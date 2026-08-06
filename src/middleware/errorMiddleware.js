const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  res.status(err.statusCode || 500).json({
    status: false,

    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
