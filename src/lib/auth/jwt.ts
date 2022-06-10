import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
export default {
  signAccessToken(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign({ payload }, accessTokenSecret, {
        expiresIn: process.env.JWT_EXPIRY || '7d',
      }, (err, token) => {
        if (err) {
          reject(new createError.InternalServerError())
        }
        resolve(token || '')
      })
    })
  },
  verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, accessTokenSecret, (err, payload) => {
        if (err) {
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(new createError.Unauthorized(message))
        }
        resolve(payload)
      })
    })
  }
}