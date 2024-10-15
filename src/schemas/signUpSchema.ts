import  {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(3,"Username must be atleast of length 2")
    .max(20,"Username must be less than 21 characters")
    .regex(/^[a-zA-Z0-9]+$/,"Username can only contain alphanumeric characters")
    
export const signUpSchema=z.object({
    username:usernameValidation,
    email: z.string().email({message:'INVALID email address'}),
    password: z.string().min(4,{message:"Password must be at least 8 characters long"}).max(50, {message:"Password must be less than 51 characters long"}),
    
})