import axios from "axios";
import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../contexts/UserContexts";
import CreateComment from "./CreateComment";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

export default function CommentSection({ post, setCounter }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [following, setFollowing] = useState([]);
  const commentsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    getComments();
    getFollowing();
  }, []);

  function getComments() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const commentsRequest = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${post.id}/comments`,
      config
    );
    commentsRequest.then((response) => {
      setComments(response.data.comments);
      setCounter(response.data.comments.length);
      focusComments();
    });
    commentsRequest.catch(() => {
      alert("Could not get comments");
    });
  }

  function getFollowing() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const followingRequest = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows`,
      config
    );
    followingRequest.then((response) => {
      const ids = response.data.users.map((user) => user.id);
      setFollowing(ids);
    });
    followingRequest.catch(() => {
      alert("Could not get who you follow");
    });
  }

  function focusComments() {
    commentsRef.current.scrollTo({
      top: commentsRef.current.scrollHeight,
      behavior: "smooth",
    });
    setTimeout(() => {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }, 500);
  }
  return (
    <StyledCommentsSection initial={!comments.length}>
      <div ref={commentsRef} className="comments">
        {comments.length === 0 ? (
          post.commentCount !== 0 ? (
            <div className="comment-box">Loading...</div>
          ) : (
            <div className="comment-box">No comments yet</div>
          )
        ) : (
          <></>
        )}
        {comments.map((comment) => {
          return (
            <div className="comment-box" key={comment.id}>
              <Avatar avatar={comment.user.avatar} id={comment.user.id} />
              <div>
                <p>
                  <Link to={`/user/${comment.user.id}`}>
                    {comment.user.username}
                  </Link>
                  <span>
                    {post.user.id === comment.user.id && " • post's author"}
                    {following.includes(comment.user.id) && " • following"}
                  </span>
                </p>
                <p className="comment">{comment.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <CreateComment
        inputRef={inputRef}
        post={post}
        getComments={getComments}
      />
    </StyledCommentsSection>
  );
}

const StyledCommentsSection = styled.div`
  width: 100%;
  max-height: ${(props) => (props.initial ? "140px" : "600px")};
  padding: 0;
  border: none;
  background-color: transparent;
  transition: 0.5s;
  font-size: 14px;
  line-height: 17px;
  .comments {
    overflow-y: auto;
    max-height: ${(props) => (props.initial ? "140px" : "420px")};

    .comment-box {
      padding: 0px 20px;
      display: flex;
      align-items: center;
      min-height: 70px;
      border-bottom: 1px solid #353535;
      p {
        margin-bottom: 3px;
      }
      a {
        font-weight: bold;
      }
      span {
        color: #565656;
      }
      .comment {
        color: #acacac;
        word-break: break-word;
      }
    }
  }
`;
