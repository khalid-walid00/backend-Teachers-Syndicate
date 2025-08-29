// middleware/response.js
const responseHelper = (req, res, next) => {
    res.sendSuccess = (data = {}, message = "تم بنجاح", statusCode = 200) => {
      return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
          page: req.pagination.page,
          limit: req.pagination.limit,
          total: data.length,
          pages: Math.ceil(data.length / req.pagination.limit),
          hasNext: req.pagination.page < Math.ceil(data.length / req.pagination.limit),
        },
      });
    };
  
    res.sendError = (message = "حدث خطأ", statusCode = 500, extra = {}) => {
      return res.status(statusCode).json({
        success: false,
        message,
        error: extra,
      });
    };
  
    next();
  };
  
  module.exports = responseHelper;
  