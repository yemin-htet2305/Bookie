import { MAX_FILE_SIZE } from "@/lib/constant";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const body= (await request.json()) as HandleUploadBody;

    try{
        const jsonResponse = await handleUpload({
            token: process.env.BLOB_READ_WRITE_TOKEN!,
            body, 
            request,
        onBeforeGenerateToken: async () => {
            const {userId} = await auth();
            if(!userId){
                throw new Error("Unauthorized: User not authenticated.");
            }
            return {
                allowedContentTypes: ['application/pdf', 'image/png', 'image/jpeg','image/jpg', 'image/webp'],
                TokenPayload: JSON.stringify({userId}),
                addRandomSuffix: true,
                maximumSizeInBytes: MAX_FILE_SIZE, // 5mB
            }
        },
        onUploadCompleted: async ({blob,tokenPayload}) => {
            console.log("File Uploaded To: ", blob.url);
            const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
            const userId = payload?.userId;
            console.log("Uploaded By User ID: ", userId);
        },
        });
        return NextResponse.json(jsonResponse);
    }catch(error){
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}