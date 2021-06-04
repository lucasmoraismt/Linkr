import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LocationButton from "./LocationButton";

export default function CreatePost({ getPosts, user }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const urlInput = useRef();
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(user ? user.avatar : "");
  }, [user]);

  function publish(e) {
    e.preventDefault();
    if (!isURL(url)) {
      setUrlError(true);
      urlInput.current.focus();
      return;
    }
    setIsLoading(true);
    const body = {
      text,
      link: url,
    };
    if (location) {
      body.geolocation = {};
      body.geolocation.latitude = location.latitude;
      body.geolocation.longitude = location.longitude;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const createPostRequest = axios.post(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts",
      body,
      config
    );
    createPostRequest.then(() => {
      setUrl("");
      setText("");
      setIsLoading(false);
      getPosts(true);
    });
    createPostRequest.catch(() => {
      alert("There was an error publishing your link");
      setIsLoading(false);
    });
  }

  function isURL(url) {
    const re =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return re.test(String(url).toLowerCase());
  }

  return (
    <Container>
      <LeftImage>
        <UserImage avatar={avatar} />
      </LeftImage>
      <PostForm onSubmit={publish}>
        <p>What do you want to favorite today?</p>
        <input
          value={url}
          onChange={(e) => {
            setUrlError(false);
            setUrl(e.target.value);
          }}
          className={urlError ? "url-error" : ""}
          placeholder={urlError ? "Fill in a valid URL" : "https://..."}
          ref={urlInput}
          disabled={isLoading}
        ></input>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Check out these awesome tips to improve your #javascript"
          disabled={isLoading}
        ></textarea>
        <div>
          <LocationButton isLoading={isLoading} setLocation={setLocation} />
          <button className="btn-publish" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </PostForm>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: white;
  color: #707070;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  margin-bottom: 30px;
  @media (max-width: 740px) {
    padding: 10px 15px;
    border-radius: 0px;
  }
`;
const LeftImage = styled.div`
  margin-right: 18px;
  @media (max-width: 740px) {
    display: none;
  }
`;
const UserImage = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-image: url("${(props) => props.avatar}");
  background-size: cover;
  background-position: center;
`;
const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: 300;
  p {
    height: 40px;
    width: 100%;
    font-size: 20px;
  }
  input,
  textarea {
    padding: 0px 13px;
    background: #efefef;
    border-radius: 5px;
    width: 100%;
    border: none;
    display: block;
    font-size: 15px;
  }
  input::placeholder,
  textarea::placeholder {
    color: #949494;
    opacity: 1;
    font-size: inherit;
  }
  input {
    height: 30px;
    margin-bottom: 5px;
  }
  input.url-error {
    background-color: #ffdbdb;
    color: red;
  }
  input.url-error::placeholder {
    color: red;
  }
  textarea {
    padding: 8px 13px;
    min-height: 66px;
    margin-bottom: 5px;
    resize: none;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn-publish {
      width: 112px;
      height: 31px;
      background: #1877f2;
      border-radius: 5px;
      border: none;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: white;
    }
    .btn-publish:disabled {
      filter: brightness(0.7);
    }
  }
  @media (max-width: 740px) {
    p {
      text-align: center;
      font-size: 17px;
    }
    input,
    textarea {
      font-size: 13px;
    }
    textarea {
      min-height: 47px;
    }
    div {
      button {
        min-width: 112px;
        height: 22px;
        font-size: 13px;
      }
    }
  }
`;
