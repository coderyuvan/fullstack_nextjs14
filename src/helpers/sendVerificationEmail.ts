import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            success: true,
            message: "verification email send successfully",
        };
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}