import { apiRscPublic } from "#src/trpc/api-rsc";
import { CreatePost } from "./CreatePost";
import { CreatePostTest } from "./CreatePostTest";
import { Wall } from "./Wall";

export default async function Page() {
  const { api } = apiRscPublic();
  const initialPosts = await api.post.latest();
  return (
    <div>
      <h1>your basic create post example with 10 latest posts server rendered</h1>
      <CreatePost />
      <CreatePostTest />
      <Wall initialData={initialPosts} />
    </div>
  );
}
