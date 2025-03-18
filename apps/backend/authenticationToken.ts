import jwt from 'jsonwebtoken'


const JWT_SECRET = 'your-secret-key' // Use env variables in production


export const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' })
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' })
        }
        req.userId = user.userId // Store userId in request object
        next()
    })
}
