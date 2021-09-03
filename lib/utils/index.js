import { Binary } from 'mongodb';
import pino from '../services/log.js';

/**
 * @param {string} error message
 * @param {status} HTTP status to return
 * @param {status} baseError in the event that we are responding to
 * an error that could be ambiguous, pass the original error too
 */

/**
 * @param {string} error message
 * @param {status} HTTP status to return
 */
export function APIError(status, message) {
  Object.defineProperty(this, 'name', {
    enumerable: false,
    writable: true,
    value: 'APIError',
  });
  Object.defineProperty(this, 'message', {
    enumerable: false,
    writable: true,
    value: message,
  });
  Object.defineProperty(this, 'status', {
    enumerable: false,
    writable: true,
    value: status,
  });
}

Object.setPrototypeOf(APIError.prototype, Error.prototype);

export class ErrorsArray extends Array {
  constructor(code, path, customMessage) {
    super();
    if (code) this.add(code, path, customMessage);
  }

  add(code, path = 'meta', message) {
    this.push({
      code,
      path,
      message,
    });
  }
}

// The 'next' is necessary here as it composes a required
// signature of an Express error handler
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'APIError') {
    if (typeof err.message !== 'undefined') {
      pino.info(err.message);
      // TODO: Deprecate this transformation
      // And enforce JSON error types
      const body = typeof err.message === 'string' ? { message: err.message } : err.message;
      return res
        .status(err.status || 500)
        .json(body);
    }
    return res.sendStatus(err.status || 500);
  }
  // Other errors
  pino.error(err);
  return res.sendStatus(500);
}

/**
 * Express middleware wrapper for async functions
 * @param {async function}
 */
export function asyncHandler(fn) {
  return (...args) => fn(...args)
    .catch((err) => args[2](err));
}

export function getAllowedProps(updateObject, allowedProps) {
  // Populating from safe rather than filtering because updateObj could be huge
  const allowedUpdateObject = {};
  allowedProps.forEach((safeProp) => {
    if (updateObject.hasOwnProperty(safeProp)) { /* eslint-disable-line no-prototype-builtins */
      allowedUpdateObject[safeProp] = updateObject[safeProp];
    }
  });
  return allowedUpdateObject;
}

export function convertBSONUUIDs(arr) {
  return arr.map(match => Object.assign({}, match, { _id: match._id.value() }));
}

export function convertBSONUUID(obj) {
  return Object.assign({}, obj, { _id: obj._id.value() });
}

export function uuidQuery(idString) {
  return { _id: new Binary(idString, Binary.SUBTYPE_UUID) };
}
