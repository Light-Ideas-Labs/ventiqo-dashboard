import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getSession } from 'next-auth/react';  // Import NextAuth session handler

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getSession({ req });
  
      // If session is null, user is not authenticated
      if (!session || !session.user) {
        throw new Error('Unauthorized');
      }
  
      // Return user metadata to be used in the upload process
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log(`File uploaded by user ${metadata.userId}:`, file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
