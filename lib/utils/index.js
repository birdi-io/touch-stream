import { Binary } from 'mongodb';
import pino from '../services/log.js';

/**
 * @param {string} error message
 * @param {status} HTTP status to return
 * @param {status} baseError in the event that we are responding to
 * an error that could be ambiguous, pass the original error too
 */

export function APIError(status, message, baseError) {
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
  Object.defineProperty(this, 'baseError', {
    enumerable: false,
    writable: true,
    value: baseError,
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

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  pino.info(err.status);
  if (err.name === 'APIError') {
    if (err.baseError) pino.error(err.baseError);
    if (typeof err.message !== 'undefined') {
      pino.info(err.message);
      return res.status(err.status || 500).json(err.message);
    }
    return res.status(err.status || 500).end();
  }
  // Service and programmer errors
  pino.error(err);
  const errors = new ErrorsArray(500, 'meta', 'Server error');
  return res.status(500).json(errors);
}

/**
 * Express middleware wrapper for async functions
 * @param {async function}
 */
export function asyncHandler(fn) {
  return (...args) => fn(...args)
    .catch((err) => {
      let newErr;
      if (err.name !== 'APIError') {
        newErr = err;
      } else newErr = err;
      args[2](newErr);
    });
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
