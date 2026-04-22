import jwt, { SignOptions } from 'jsonwebtoken'

export interface JwtPayload {
  roomNumber: string
}

// 与 controllers/auth.ts 中 jwt.sign 使用的默认密钥保持一致，否则未配置环境变量时会登录成功但后续请求 401
function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'your_jwt_secret_key'
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = getJwtSecret()
  const options: SignOptions = {
    expiresIn: 15 * 24 * 60 * 60
  }
  return jwt.sign(payload as object, secret, options)
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload
}
