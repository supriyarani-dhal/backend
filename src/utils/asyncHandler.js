//its a wrapper used to solve all the requests ,so that it dont have to do the try catch again and again
const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
