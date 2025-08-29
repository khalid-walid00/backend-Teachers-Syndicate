const notFound = (req, res, next) => {
    const error = new Error(`العنوان غير موجود - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    let message = err.message;
  
    if (err.name === 'CastError') {
      message = `لم يتم العثور على العنصر المطلوب (${err.path})`;
      res.status(404);
    }
  
    if (err.code && err.code === 11000) {
      message = `القيمة مكررة في الحقل: ${Object.keys(err.keyValue).join(', ')}`;
      res.status(409);
    }
  
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message).join(', ');
      res.status(400);
    }
  
    if (err.name === 'JsonWebTokenError') {
      message = 'رمز الدخول غير صالح';
      res.status(401);
    }
  
    if (err.name === 'TokenExpiredError') {
      message = 'انتهت صلاحية رمز الدخول';
      res.status(401);
    }
  
    return res.sendError(
      message,
      res.statusCode,
      process.env.NODE_ENV === "production" ? {} : { stack: err.stack }
    );
  };
  
  module.exports = { 
    notFound,
    errorHandler
   };
  