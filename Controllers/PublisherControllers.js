const Publisher = require("../models/Publisher")
const AITools = require("../models/AITools")
const Categories = require("../models/Categories")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")


const registerPublisher  = async (req, res) =>{
    const {Username, email, number, password} = req.body;
    console.log("inside the registerUser")
    console.log(Username, email, number, password)
    
    if(!Username || !email || !number || !password ){
        console.log("fill all data")
        return res.status(422).json({error : "Plz fill all the field"});
    } 

    try{
        const publisherExist = await Publisher.findOne({email : email});
        const publisherNum = await Publisher.findOne({number: number});

        if( publisherExist ){
            // console.log("Email already exist")
            return res.status(409).json({error : "Email already exist",data: "email"});
        }else if( publisherNum ){
            // console.log("number already exist")
            return res.status(409).json({error : "number already exist", data: "number"});
        }else {
            // console.log("inside the else loop")
            const user = new Publisher({Username, email, number, password});
            await user.save();
            res.status(201).json({ message: "Register Successful" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({error : "Oops something went wrong"});
    }
}

const signInPublisher = async (req, res) =>{
    try{

        let token; 
        const { email, password } = req.body;

        if(email){
            if(email || password){
                var publisherLogin = await Publisher.findOne( { email: email } );
            }

        }else{
            return res.status(400).json({error : "invalid login details"});
        } 

        if(publisherLogin){
            const isMatch = await bcrypt.compare(password, publisherLogin.password);

            token = await publisherLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            if(!isMatch){
                res.status(400).json({ error : "Invalid Credential"});
            } else {
                res.status(200).json({ 
                    message : "user SignIn successfully!!..",
                    email: publisherLogin.email,
                    userType: publisherLogin.UserType,
                    token 
                });
            }
        }else{
            res.status(400).json({ error : "Invalid Credential"}); 
        }


    } catch (err) {
        res.status(500).json({ error :"Oops something went wrong"});
    }
}

const logOutPublisher = async (req, res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !==  req.token;
        })

        await req.user.save();
        
        res.clearCookie("jwtoken");

        res.status(200).json({ message : "user Logout successfully!!.." });

    } catch (err) {
        // console.log(err)
        res.status(500).json({ error : "user Logout Unsuccessfully!!.." });

    }
}

const LoutOutAllDevicesPublisher = async (req, res) => {
    try {

        req.user.tokens = []; 
        await req.user.save();
        

        res.clearCookie("jwtoken", {path:'/'});

        res.status(200).json({ message : "user Logout successfully!!..", });

    } catch (error) {
        res.status(500).json({ error : "user Logout Unsuccessfully!!..", });

    }
} 

const updateEmailPublisher = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {email} = req.body;

        if(!email.trim()){
            return res.status(422).json({error : "Plz fill the field"});
        }
        // console.log("after inside")
        const publisherExist = await Publisher.findOne({email});
        // console.log("after fetching", publisherExist)
        if( publisherExist ){
            // console.log("Email already exist")
            return res.status(409).json({error : "Email already exist"});
        }
        await Publisher.findByIdAndUpdate( _id, {email},{
            new : true
        });
        res.status(201).json({ message: "email updated successfully"});
        // console.log("email Updated successfully")
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const updateNumberPublisher = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {number} = req.body;

        if(!number.trim()){
            return res.status(422).json({error : "Plz fill the field"});
        }
        // console.log("after inside")
        const publisherExist = await Publisher.findOne({number});
        // console.log("after fetching", publisherExist);
        if( publisherExist ){
            // console.log("Number already exist")
            return res.status(409).json({error : "Number already exist"});
        }
        const updateEmail = await Publisher.findByIdAndUpdate( _id, {number},{
            new : true
        });
        res.status(201).json({ message: "number updated successfully" });
        // console.log("number Updated successfully")
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const UpdatePasswordPublisher = async (req, res) =>{
    try {
        const _id = req.params.id;
        const {password, curr_password} = req.body;
        // console.log("from the req.body",password,curr_password)

        if( !password || !curr_password ){
            return res.status(422).json({error : "Plz fill the field"});
        }

        const updatePassword = await Publisher.findById(_id)
        // console.log("inside the update password", updatePassword)
        if(updatePassword){
            // console.log("entered the if condition",curr_password, updatePassword.password);
            const isMatch = await bcrypt.compare(curr_password, updatePassword.password);
            // console.log("inside the updatePassword ")
            if(!isMatch){
                // console.log("couldn't match");
                res.status(400).json({ error : "current password wont match"});
            } else {
                // console.log("password matched")
                updatePassword.password = password
                updatePassword.save(); 
                res.status(201).json({ message: "password updated successfully" });
                // console.log("password Updated successfully");
            }
        }else{
            res.status(404).json({ error : "user Not Found" }); 
        }
    } catch (err) {
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const getPublisher = async (req, res) => res.send(req.rootPublisher);

const deletePublisherAccount = async (req, res) =>{
    try{

        const _id = req.params.id;
        const User_ID = _id;
        const {passDel} = req.body
        let password = passDel

        const UserLog = await Publisher.findById(_id);
        
        const isMatch = await bcrypt.compare(password, UserLog.password);

        if(isMatch){  
    
            const catID = await AITools.findOne({UID: User_ID},{CategoryID:1})
            await Categories.findByIdAndDelete({_id: catID})
            await AITools.deleteMany({UID: User_ID})

            res.clearCookie("jwt", {path:'/'});
            await Publisher.findByIdAndDelete(_id)
    
            res.status(201).json({ message: "Account is deleted successfully" });
            // console.log("Account is deleted successfully")
        }else{
            // console.log("password do not match")
            res.status(400).json({ error : "Invalid Credential"});
        }

    }catch(err){
        // console.log(err);
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

// Password Reset
const getSinglePublisher = async (req,res) =>{
    try {
        const data = await Publisher.find({email: req.body.email},{Username:1,Profile_pic:1,email:1})
        // console.log(data)
        
        if(data.length > 0){
            res.status(200).json(data);
        }else{
            res.status(404).json({error:"User not found"})
        }
        
    } catch (err) {
        // console.log(err)
        res.status(500).json({error: "oops Something went wrong!!.."})
    }
}

const forgotPasswordPublisher = async (req, res) =>{
    try {
        
        const {email} = req.body;
        const check = await Publisher.findOne({email});

        // Function to generate OTP
        const generateOTP = () =>{
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++ ) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return Number(OTP); 
        }

        const DelOTP = async () =>{
            await Publisher.findOneAndUpdate({email},{OTP:null})
            console.log("OTP deleted successfull!!..")
        }

        if(check === null){
            res.status(422).json({ message: "No search results" });
        }else{
            // console.log(email)
            let otp = generateOTP()
            // console.log(otp)
            await Publisher.findOneAndUpdate({email},{OTP:otp})
            // console.log("before set timeout") 

            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth:{
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            let details = {
                from:  `AI Tools <${process.env.EMAIL_ID}>`,
                to: email,
                subject: " AITools OTP ",
                html:
                `Hi ${check?.Username}, <br/><br/>
                Please use the following OTP to reset your password <br/>
                <b>OTP:</b> ${otp} <br/><br/><br/>
                                
                Regards <br/>
                AITools                           `
            }

            mailTransporter.sendMail(details, (err) =>{
                if(err){
                    // console.log("error=> ",err)
                    res.status(400).json({ message: "Oops something went wrong!!.."  }); 
                }else{
                    // console.log("email has sent") 
                    setTimeout(DelOTP, 300000)
                    res.status(201).send({message: "otp sent successfully!!.."});
                } 
            })
            
        }

    } catch (err) {
        res.status(500).json({ error: "Oops Something Went Wrong!!.." }); 
    }

}

const matchOTPPublisher = async(req, res) =>{
    try {
        // console.log("inside the otp-match")
        const {OTP,email} = req.body;
        // console.log(req.body)
        const check = await Publisher.findOne({email});

        if(check === null){
            // console.log("invalid email")
            res.status(422).json({error: "invalid email"})
        }else{
            if(check.OTP === Number(OTP)){
                await Publisher.findOneAndUpdate({email},{OTP:null})
                res.status(200).json({message: "OTP Verified!!.."})
            }else{
                res.status(422).json({message: "Invalid OTP!!.."})
            }
        }

    } catch (err) {
        // console.log(err)
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}

const changePasswordOTPPublisher = async (req, res) =>{
    try {
        // console.log("inside change-otp-pass")
        const {password, cpassword, email} = req.body;
        const updatePassword = await Publisher.findOne({email})

        if(updatePassword){
            if(!password || !cpassword){
                return res.status(422).json({error : "Plz fill all the field"});
            }
            updatePassword.password = password
            // updatePassword.cpassword = cpassword
            updatePassword.save(); 
            res.status(201).json({ message: "password changed successfully" });
            // console.log("password changed successfully");
        }else{
            // console.log("Oops No User Found ")
        res.status(400).json({error: "Oops Email did't match"})
        }

    } catch (err) {
        // console.log(err)
        res.status(500).json({error: "oops something went wrong!!.."})
    }
}





module.exports = {registerPublisher, signInPublisher, logOutPublisher, 
    LoutOutAllDevicesPublisher, updateEmailPublisher, updateNumberPublisher, 
    UpdatePasswordPublisher, getPublisher, deletePublisherAccount, getSinglePublisher, 
    forgotPasswordPublisher, matchOTPPublisher, changePasswordOTPPublisher}