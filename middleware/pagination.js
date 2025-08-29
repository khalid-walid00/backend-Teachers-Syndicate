const pagination = (defaultLimit = 10) => {
    return (req, res, next) => {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || defaultLimit;
  
      if (page < 1) page = 1;
      if (limit < 1) limit = defaultLimit;
  
      const skip = (page - 1) * limit;
  
      req.pagination = {
        page,
        limit,
        skip,
      };
  
      next();
    };
  };
  
  module.exports = pagination;
  