export const validateRole = (authorizedRoles) => {
    return (req, res, next) => {

        const userRole = req.user.role;

        if(authorizedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: "Access forbidden for this area!"})
        }

    }
};