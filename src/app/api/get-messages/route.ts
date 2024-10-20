import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function GET(request: Request) {

  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user.id);

  try {
    const user=await UserModel.aggregate([
        { 
            $match:{id:userId }
        },
        // got array unwind it
        {
            $unwind:'$messages'
        },
        {
            $sort:{'messages.createdAt':-1}
        },
        {
            $group:{
                _id:'$_id',
                messages:{$push:'$messages'}
            }
        }
    ])
    if(!user || user.length===0) {
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return Response.json(
        { success: true, messages: user[0].messages },
        { status: 200 });
  } catch (error:any) {
    console.error('Error getting message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
