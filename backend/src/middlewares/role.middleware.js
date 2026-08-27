// REUSEABLE RoleMiddleware

const roleMiddleware = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"Authentication required"
            })
        }
    }
}