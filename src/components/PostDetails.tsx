import ReactIcons from "@/assets/icons";
import LikeAndComment from "@/components/LikeAndComment";
import PostOptions from "@/components/PostOptions";
import ShowPostMessage from "@/components/ShowPostMessage";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/lib/Loading";
import Toastify, { ToastContainer } from "@/lib/Toastify";
import { Post, User } from "@/types";
import { deleteReq, postReq } from "@/utils/api/api";
import actualDateAndTime from "@/utils/javascript/actualDateAndTime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToPost, postState } from "@/redux/slice/postSlice";

type Props = {
  post: Post;
  actualUser: User;
  userReply?: boolean;
  isReply?: boolean;
};

const PostDetails = ({
  post,
  actualUser,
  userReply = false,
  isReply = false,
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorMessage } = Toastify();
  const [isFollow, setIsFollow] = useState(post.isFollow);
  const { updatePost, deletePost } = useSelector(postState);

  useEffect(() => {
    if (post) {
      setIsFollow(post.isFollow);
    }
  }, [post]);

  useEffect(() => {
    if (post._id) {
      dispatch(addToPost(post._id));
    }
  }, [post._id, dispatch]);

  const newPost = useMemo(() => {
    if (updatePost.length === 0) return post;
    const findPost = updatePost.find((obj) => obj._id === post._id);
    if (findPost) {
      const updatedPost = {
        ...findPost,
        isFollow: post.isFollow,
      };
      return updatedPost;
    }
    return post;
  }, [post, updatePost]);

  const isDeleted = useMemo(() => {
    if (deletePost.includes(post._id)) {
      return true;
    }
    return false;
  }, [deletePost, post._id]);

  useEffect(() => {
    if (isDeleted) {
      navigate(-1);
    }
  }, [isDeleted, navigate]);

  if (isDeleted) return;

  const {
    user: { _id, name, username, photo },
    message,
    media,
    createdAt,
  } = newPost;

  const isItActualUser = username === actualUser.username;

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await postReq("/user/following", { id: _id });
      setIsFollow(true);
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelFollow = async () => {
    try {
      setIsLoading(true);
      await deleteReq("/user/following", { id: _id });
      setIsFollow(false);
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-start py-2 px-5">
        <div className="flex gap-3">
          <div className="w-9 md:w-10 prevent-navigation">
            <Link to={`/${username}`}>
              <img
                src={photo}
                alt={name}
                className="w-full rounded-full"
                loading="lazy"
              />
            </Link>
          </div>
          <div className="">
            <p className="font-semibold text-user_name text-sm hover:underline underline-offset-4">
              <Link to={`/${username}`}>{name}</Link>
            </p>
            <p className="text-grey text-sm">@{username}</p>
          </div>
        </div>

        <div>
          {isItActualUser ? (
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-grey p-2 hover:bg-gray-300 hover:rounded-full">
                  <ReactIcons.threeDot />
                </DropdownMenuTrigger>
                <PostOptions post={newPost} isReply={isReply} />
              </DropdownMenu>
            </Dialog>
          ) : isFollow ? (
            <button
              disabled={isLoading}
              className="w-max self-end following"
              onClick={handleCancelFollow}
            >
              {isLoading ? <Loading /> : "Following"}
            </button>
          ) : (
            <button
              disabled={isLoading}
              className="w-max my-5 self-end follow"
              onClick={handleFollow}
            >
              {isLoading ? <Loading /> : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="px-5">
        <ShowPostMessage message={message} media={media} />
      </div>

      <div
        className={`${
          userReply ? "" : "border-b border-div_border"
        }  py-2 px-5`}
      >
        <p className="text-grey">{actualDateAndTime(createdAt)}</p>
      </div>
      <div className="py-1 border-b border-div_border px-5">
        <LikeAndComment post={newPost} user={actualUser} />
      </div>
      <ToastContainer />
    </>
  );
};

export default PostDetails;
