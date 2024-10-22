import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username") || "",
    };

    console.log("Received username:", queryParam.username); // For debugging

    const res = userNameQuerySchema.safeParse(queryParam);
    if (!res.success) {
      const usernameErrors = res.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        }),
        { status: 400 }
      );
    }

    const { username } = res.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is unique",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
