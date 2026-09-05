// REUSEABLE RoleMiddleware

// (...allowedRoles) means we can pass one or multiple roles and they will store like an array

// roleMiddleware("admin") => allowedRoles = ["admin"]

// roleMiddleware("trainer", "admin") => allowedRoles=["trainer","admin"]

const roleMiddleware = (...allowedRoles)=>{
    return (req,res,next)=>{

        // Check if user exist
        if(!req.user){
            return res.status(401).json({
                message:"Authentication required"
            })
        }

        // Check if user's role is allowed
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"Access denied. You do not have permission."
            })
        }

        // User has required role
        next()
    }
}

module.exports= roleMiddleware;