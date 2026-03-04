const pool=require('../config/db');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
exports.register=async(req,res)=>{
    const{name,phone,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    await pool.query(
        "INSERT INTO Users(name,phone,password)VALUES($1,$2,$3)",
        [name,phone,hashedPassword]
    );
    res.json({msg:"User Registered"});
};
exports.login=async(req,res)=>{
    const{phone,password}=req.body;
    const user=await pool.query(
        "SELECT* from Users where phone=$1",
        [phone]
    );
    if(user.rows.length===0)
        return res.status(400).json({
    msg:"User not found"});
    const valid=await bcrypt.compare(password,user.rows[0].password);
    if(!valid)
        return res.status(400).json({
    msg:"Password not match"});
    const token=jwt.sign(
        {userId:user.rows[0].id},
        process.env.JWT_SECRET
    );
     res.json({ token, userId: user.rows[0].id });
}