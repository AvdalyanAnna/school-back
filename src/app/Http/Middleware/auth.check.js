const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.cookies.token || null
    if (token) {
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        if (!payload) {
            return res.status(401).send('Unauthorized request')
        }
        req.auth = payload
        req.token = token
        next()
    } else {
        return res.status(401).send('Unauthorized request')
    }
}

