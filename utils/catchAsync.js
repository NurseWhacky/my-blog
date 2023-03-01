// wrapper for async func
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
