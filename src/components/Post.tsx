import ReactIcons from "@/assets/icons";
import PostOptions from "@/components/PostOptions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import formatRelativeDate from "@/utils/javascript/formatRelativeDate";
import Toastify, { ToastContainer } from "@/lib/Toastify";
import { deleteReq, getReq } from "@/utils/api/api";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import LikeAndComment from "./LikeAndComment";
import { type Post, User } from "@/types";
import ShowPostMessage from "./ShowPostMessage";

const Post = ({
  post,
  isReply = false,
  showLine = false,
  defaultLike = false,
  defaultSave = false,
}: {
  post: Post;
  isReply?: boolean;
  showLine?: boolean;
  defaultLike?: boolean;
  defaultSave?: boolean;
}) => {
  const navigate = useNavigate();
  const { actualUser }: { actualUser: User } = useOutletContext();
  const { showErrorMessage } = Toastify();
  const { pathname } = useLocation();
  const [isLiked, setIsLiked] = useState(defaultLike);
  const [isSaved, setIsSaved] = useState(defaultSave);

  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 50% of the element is in view
    triggerOnce: true, // Only trigger once when it comes into view
    rootMargin: "200px 0px", // Trigger 100px before the element enters the viewport
  });

  const {
    _id,
    user: { username, name, photo },
    message,
    media,
    likeCount,
    saveCount = 0,
    createdAt,
  } = post;

  useEffect(() => {
    if (inView && !isLiked) {
      (async () => {
        try {
          const like = await getReq("/like", { id: _id });

          if (!like) {
            setIsLiked(false);
          } else {
            setIsLiked(true);
          }
        } catch (error) {
          showErrorMessage({
            message:
              error instanceof Error ? error.message : "Somethign went wrong",
          });
        }
      })();
    }
  }, [inView, showErrorMessage, _id, isLiked]);

  useEffect(() => {
    if (inView && !isSaved) {
      (async () => {
        try {
          const save = await getReq("/save", { id: _id });

          if (!save) {
            setIsSaved(false);
          } else {
            setIsSaved(true);
          }
        } catch (error) {
          showErrorMessage({
            message:
              error instanceof Error ? error.message : "Something went wrong",
          });
        }
      })();
    }
  }, [inView, showErrorMessage, _id, isSaved]);

  const handleScroll = () => {
    if (pathname.startsWith(`/${username}`)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReq("/post", { id: _id });
    } catch (error) {
      showErrorMessage({
        message: error instanceof Error ? error.message : "",
      });
    }
  };

  const handleNavigate = (target: EventTarget) => {
    if (!target.closest(".prevent-navigation")) {
      if (!isReply) {
        navigate(`/posts/${_id}`);
        return;
      }
      navigate(`/reply/${_id}`);
      return;
    }
  };

  return (
    <>
      <div
        onClick={(e) => handleNavigate(e.target)}
        ref={ref}
        className={`${
          showLine ? "" : "border-b border-div_border"
        }  cursor-pointer  w-full px-5 pt-3 flex gap-5 hover:bg-gray-100`}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-9 md:w-10 prevent-navigation">
            <Link to={`/${username}`} onClick={handleScroll}>
              <img
                src={photo}
                alt={name}
                className="w-full rounded-full"
                loading="lazy"
              />
            </Link>
          </div>
          {showLine && <div className="h-full w-[2px] bg-div_border" />}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="prevent-navigation flex items-center gap-2">
              <p className="font-semibold text-user_name text-sm hover:underline underline-offset-4">
                <Link to={`/${username}`} onClick={handleScroll}>
                  {name}
                </Link>
              </p>
              <div className="flex items-center">
                <p className="text-grey text-sm">@{username}</p>
                <p className="text-grey">
                  <ReactIcons.dot />
                </p>
                <p className="text-grey text-sm">
                  {formatRelativeDate(createdAt)}
                </p>
              </div>
            </div>

            {username === actualUser.username && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="text-grey prevent-navigation">
                    <ReactIcons.threeDot />
                  </button>
                </DropdownMenuTrigger>
                <PostOptions handleDelete={handleDelete} />
              </DropdownMenu>
            )}
          </div>
          <ShowPostMessage media={media} message={message} />
          <LikeAndComment
            postId={_id}
            like={isLiked}
            likeCount={likeCount}
            save={isSaved}
            saveCount={saveCount}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Post;
