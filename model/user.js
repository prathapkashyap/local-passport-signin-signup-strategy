const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/user',{useNewUrlParser:true});
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;
var userSchema=new Schema({
    username:{type:String,require:true},
    password:{type:String,required:true},
    email:{type:String,required:true}
});

//schema methods for validation and hashing passwords
userSchema.methods.encryptPassword=(password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
userSchema.methods.validatePassword=function(password){
    return bcrypt.compareSync(password,this.password);
};
var User=mongoose.model('User',userSchema);
module.exports=User;
