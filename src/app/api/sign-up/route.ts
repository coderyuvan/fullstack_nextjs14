import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";