import axios from "axios";
import { IoPaperPlaneOutline } from "react-icons/io5";
import styled from "styled-components";
import { useContext, useState } from "react";
import UserContext from "../../contexts/UserContexts";
import Avatar from "./Avatar";

export default function CommentSection({ post, getComments, inputRef }) {
  const { user } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function sendComment(e) {
    e.preventDefault();
    if (!comment.trim()) {
      inputRef.current.focus();
      return;
    }
    setIsLoading(true);
    const body = { text: comment.trim() };
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const postComment = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${post.id}/comment`,
      body,
      config
    );
    postComment.then(() => {
      setComment("");
      getComments();
      setIsLoading(false);
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    });
    postComment.catch(() => {
      alert("Could not post comment at this time");
      setIsLoading(false);
      inputRef.current.focus();
    });
  }

  return (
    <CreateCommentContainer onSubmit={sendComment}>
      <Avatar avatar={user.avatar} id={user.id} />
      <input
        ref={inputRef}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={"write a comment..."}
        disabled={isLoading}
      ></input>
      <button disabled={isLoading}>
        <IoPaperPlaneOutline />
      </button>
    </CreateCommentContainer>
  );
}

const CreateCommentContainer = styled.form`
  min-height: 70px;
  padding: 0px 20px;
  width: 100%;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  position: relative;
  input {
    width: 100%;
    height: 40px;
    background: #252525;
    border-radius: 8px;
    border: none;
    color: #acacac;
    padding: 0px 40px 0px 15px;
  }
  input::placeholder {
    font-style: italic;
    color: #575757;
  }

  button {
    border: none;
    background-color: transparent;
    color: #f3f3f3;
    position: absolute;
    right: 24px;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input:disabled,
  button:disabled {
    filter: brightness(0.5);
  }
`;
