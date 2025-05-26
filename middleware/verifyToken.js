const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = 'qwertyuiop@1234';



async function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log(token)

  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true },
    });
    console.log(user)

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Token error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;


// JWT --> Refersh Token, 

// cursor --> 11

// generate opt --> post emailid --> smpt otp --> token, opt sent sucess 
// verify opt --> post opt, token --> de(token) === opt --> chnged the passwd

// APIKEY -->  APIKEY <-- 

// Razory pay 

//  limit, offset --> 1,2,3,

// CRSF token
