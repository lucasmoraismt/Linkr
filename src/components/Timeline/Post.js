import ReactHashtag from "react-hashtag";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BiRepost } from "react-icons/bi";

import PostStyle from "../Styles/PostStyle";

import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import RepostButton from "./RepostButton";
import EditArea from "./EditArea";
import Likes from "../Likes/Likes";
import CommentsButton from "../Comments/CommentsButton";
import CommentsSection from "../Comments/CommentsSection";
import LocationIndicator from "./LocationIndicator";

import styled from "styled-components";
import "./ModalStyle.css";
import Modal from "react-modal";
import { VscChromeClose } from "react-icons/vsc";

Modal.setAppElement("#root");

export default function Post({ post, getPosts, userId, removePost }) {
  const {
    linkImage,
    linkTitle,
    linkDescription,
    id,
    user,
    link,
    text,
    geolocation,
  } = post;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showingComments, setShowingComments] = useState(false);
  const [loadedComments, setLoadedComments] = useState(false);
  const [alteredText, setAlteredText] = useState(text);
  const [error, setError] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [commentCounter, setCommentCounter] = useState(post.commentCount);

  function editToggle() {
    if (isLoading) {
      return;
    }
    if (isEditing) {
      setIsEditing(false);
      return;
    } else {
      setIsEditing(true);
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <PostStyle
      avatar={user.avatar}
      image={linkImage}
      showingComments={showingComments}
    >
      {post.repostId && (
        <div className="repost">
          <div>
            <BiRepost />
            Reposted by{" "}
            <Link to={`/user/${post.repostedBy.id}`}>
              {post.repostedBy.id === userId ? "you" : post.repostedBy.username}
            </Link>
          </div>
          {post.repostedBy.id === userId && (
            <DeleteButton
              postId={post.repostId}
              userId={post.repostedBy.id}
              repost={true}
              removePost={removePost}
            />
          )}
        </div>
      )}
      <div className="post-content">
        <div className="post-left">
          <Link className="user-image" to={`/user/${user.id}`}>
            <div />
          </Link>
          <Likes post={post}></Likes>
          <CommentsButton
            post={post}
            counter={commentCounter}
            loadedComments={loadedComments}
            setLoadedComments={setLoadedComments}
            showingComments={showingComments}
            setShowingComments={setShowingComments}
          />
          <RepostButton post={post} getPosts={getPosts} />
        </div>
        <div className="post-right">
          <div className="top">
            <div>
              <Link to={`/user/${user.id}`} className="username">
                {user.username}
              </Link>
              {geolocation && (
                <LocationIndicator
                  user={user.username}
                  geolocation={geolocation}
                />
              )}
            </div>
            <div>
              <EditButton
                userId={user.id}
                edit={editToggle}
                error={error}
                setError={setError}
                setIsEditing={setIsEditing}
              />
              <DeleteButton
                postId={id}
                userId={user.id}
                removePost={removePost}
                repost={false}
              />
            </div>
          </div>
          <p className="user-text">
            {isEditing ? (
              <EditArea
                id={post.id}
                setAlteredText={setAlteredText}
                alteredText={alteredText}
                setIsLoading={setIsLoading}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isLoading={isLoading}
                setError={setError}
              />
            ) : (
              <ReactHashtag
                renderHashtag={(hashtagValue) => (
                  <Link
                    to={`/hashtag/${hashtagValue.substring(1)}`}
                    className="hashtag"
                    key={hashtagValue}
                  >
                    {hashtagValue}
                  </Link>
                )}
              >
                {alteredText}
              </ReactHashtag>
            )}
          </p>
          <Modal
            className="location preview"
            overlayClassName="overlay"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
          >
            <Preview>
              <Top>
                <a href={link} target="_blank" rel="noreferrer">
                  Open in a new tab
                </a>
                <VscChromeClose fontSize="24px" onClick={closeModal} />
              </Top>
              <iframe
                className="i-frame"
                title="preview"
                src={link}
                loading="lazy"
                fullscreen
              ></iframe>
            </Preview>
          </Modal>
          <div className="link" onClick={openModal}>
            <div className="texts">
              <p className="link-title">{linkTitle}</p>
              <p className="link-description">{linkDescription}</p>
              <p className="link-url">{link}</p>
            </div>
            <div className="image"></div>
          </div>
        </div>
      </div>
      <div className="comment-section">
        {loadedComments ? (
          <CommentsSection post={post} setCounter={setCommentCounter} />
        ) : null}
      </div>
    </PostStyle>
  );
}
const Preview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 16px;

  .i-frame {
    background: white;
    width: 100%;
    height: 520px;
    margin-bottom: 20px;
  }

  @media (max-width: 780px) {
    margin-top: 10px;
    margin-bottom: 30px;
    height: 500px;
  }
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;

  a {
    width: 138px;
    height: 31px;
    background: #1877f2;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    cursor: pointer;
  }
`;
