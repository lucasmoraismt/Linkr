import ReactHashtag from "react-hashtag";
import { useState } from "react";

import PostStyle from "../Styles/PostStyle";

import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import EditArea from "./EditArea";

import Likes from "../Likes/Likes";
import LocationIndicator from "./LocationIndicator";
import { Link } from "react-router-dom";

export default function Post({ post, reload }) {
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
  const [alteredText, setAlteredText] = useState(text);
  const [error, setError] = useState(false);

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
  return (
    <PostStyle avatar={user.avatar} image={linkImage}>
      <div className="post-left">
        <Link className="user-image" to={`/user/${user.id}`}>
          <div />
        </Link>
        <Likes post={post}></Likes>
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
            <DeleteButton postId={id} userId={user.id} reload={reload} />
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
        <a href={link} className="link" target="_blank" rel="noreferrer">
          <div className="texts">
            <p className="link-title">{linkTitle}</p>
            <p className="link-description">{linkDescription}</p>
            <p className="link-url">{link}</p>
          </div>
          <div className="image"></div>
        </a>
      </div>
    </PostStyle>
  );
}
