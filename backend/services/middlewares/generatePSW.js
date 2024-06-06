
export const generateRandomPSW = async (req, res, next) => {

    let password = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    req.body.password = password;

    next();
}