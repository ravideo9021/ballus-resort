import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  media: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
