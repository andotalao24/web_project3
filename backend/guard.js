// Middleware: only let the request continue if someone is logged in.
// Passport sets req.isAuthenticated() based on the session cookie.
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}
