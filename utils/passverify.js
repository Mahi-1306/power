const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = 'qwertyuiop@1234';
const registerUser = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        throw new Error('Username already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return 'User registered successfully';
};

const loginUser = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Incorrect password');
    }

    // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign({ userId: "1" }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });

    return 'Login successful';
};

module.exports = {
    registerUser,
    loginUser,
};
