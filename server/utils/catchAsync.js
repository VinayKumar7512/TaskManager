/**
 * Utility function to catch async errors
 * @param {Function} fn - The async function to be wrapped
 * @returns {Function} Express middleware function
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}; 