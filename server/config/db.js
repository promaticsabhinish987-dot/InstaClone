const mongoose=require("mongoose");

const dbConnect=async ()=>{
try{
await mongoose.connect("mongodb://localhost:27017/demoAuth");
console.log("DB connected successfully")
}catch(err){
console.log("can not connect with database ", err)
}
}


module.exports=dbConnect;