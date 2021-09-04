import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { APIError } from '../../utils/index.js';
import { config } from '../../config.js';

/**
 * authentication check
 */
export const json = passport.authenticate('local', { session: false });

function passwordAuthentication(username, password, done) {
  if (password === config.APP_PASSWORD) return done(null, { authorised: true });
  throw new APIError(403, 'Unauthorised');
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, passwordAuthentication));

/**
 * authorise middleware
 * Unwraps bearer token, checks for validity and progresses user
 */
export const authorise = ({ required = true } = {}) => (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user && required === false) return next(); // Routes that don't require auth
    if (err || !user) return next(new APIError(401, 'Authorisation required'));
    return next();
  })(req, res, next);

// Passport authorization middleware
const tokenOpts = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  ]),
};
function tokenCallback(jwt, done) {
  return done(null, { authorised: true });
}
passport.use('jwt', new JwtStrategy(tokenOpts, tokenCallback));
