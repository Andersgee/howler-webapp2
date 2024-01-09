import { apiRscPublic } from "#src/trpc/api-rsc";
import { CreatePost } from "./CreatePost";
import { Wall } from "./Wall";

export default async function Page() {
  const { api } = apiRscPublic();
  const initialPosts = await api.post.latest();
  return (
    <div>
      <h1>your basic create post example with 10 latest posts server rendered</h1>
      <CreatePost />
      <Wall initialData={initialPosts} />
    </div>
  );
}
