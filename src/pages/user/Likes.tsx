import Post from "@/components/Post";
import useUserLikedPosts from "@/hooks/useUserLikedPosts";
import Loading from "@/lib/Loading";
import { type Post as PostType } from "@/types";
import { useEffect, useState } from "react";

const Likes = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const { isLoading, error, data } = useUserLikedPosts(page);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setPosts(data.data);

        return;
      }
      setPosts((prev) => [...data.data, ...prev]);
    }
  }, [data, page]);

  if (isLoading) {
    return <Loading hScreen={false} small={false} />;
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => {
        return <Post key={post._id} post={post} defaultLike={true} />;
      })}
      <div className="h-96" />
    </>
  );
};

export default Likes;
