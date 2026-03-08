import jwt from 'jsonwebtoken';

export const autenticar = (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({ message: "Não autorizado" });
    }

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = userInfo; 
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(401).json({ message: "Token inválido" });
    }
};

