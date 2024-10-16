import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect();
    try {
       const{email,username,password}= await request.json()
       const exsistingUserVerifiedByUsername=await UserModel.findOne({
        username,
        isVerified: true
       })
       if(exsistingUserVerifiedByUsername){
        return Response.json({
            success: false,
            message: "Username is already taken"
        },
        {
            status: 400
        }
        )}


        const exsistingUserByEmail=await UserModel.findOne({email})
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(exsistingUserByEmail){
           if(exsistingUserByEmail.isVerified){
            return Response.json(
                {
                  success: false,
                  message: 'User already exists with this email',
                },
                { status: 400 }
              );
        } 
           else{
            const hashedPassword = await bcrypt.hash(password, 10);
            exsistingUserByEmail.password = hashedPassword;
            exsistingUserByEmail.verifyCode = verifyCode;
            exsistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await exsistingUserByEmail.save();
        } 
    }
        else{
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
           const newUser= new UserModel({
                username ,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save()
            }
           const emailResponse= await sendVerificationEmail(email,username,verifyCode)
           if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }
          return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
          );
        }
    catch (error) {
        console.log("error while registering user",error)
        return Response.json({
            success: false,
            message: "Failed to register user"
        },
        {
            status: 500
        }
    )}
}