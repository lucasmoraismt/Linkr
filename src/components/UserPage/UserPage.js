import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import UserContext from "../../contexts/UserContexts";

import Loading from "../Loading/Loading";
import StyledTimeline from "../Styles/StyledTimeline";
import PostsList from "../Timeline/PostsList";

import styled from "styled-components";
import useInterval from "../useInterval/useInterval";

export default function UserPage() {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useContext(UserContext);
  const { userId } = useParams();

  const [displayButton, setDisplayButton] = useState(true);
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.id === Number(userId)) {
        setDisplayButton(false);
      }
      setIsLoading(true);
      setUserInfo("");
      setPosts();
      getInfo();
      getPosts();
      getFollows();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getInfo();
      getFollows();
      getPosts(true, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [userId]);

  function getPosts(earlier, reset) {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    let url = `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${userId}/posts`;
    let referenceId;
    if (!reset) {
      if (earlier) {
        if (posts) {
          referenceId = posts[0].repostId ? posts[0].repostId : posts[0].id;
          url = `${url}?earlierThan=${referenceId}`;
        }
      } else {
        if (posts && posts.length > 0) {
          referenceId = posts[posts.length - 1].repostId
            ? posts[posts.length - 1].repostId
            : posts[posts.length - 1].id;
          url = `${url}?olderThan=${referenceId}`;
        }
      }
    }
    const request = axios.get(url, config);
    let refreshPosts;
    request.then((response) => {
      if (earlier && !reset) {
        if (posts) {
          refreshPosts = [...response.data.posts, ...posts];
        } else {
          refreshPosts = [...response.data.posts];
        }
      } else {
        if (reset) {
          refreshPosts = [...response.data.posts];
        } else {
          refreshPosts = posts
            ? [...posts, ...response.data.posts]
            : [...response.data.posts];
        }
        if (response.data.posts.length < 10) {
          setHasMore(false);
        }
      }
      setPosts(refreshPosts);
      setIsLoading(false);
    });

    request.catch(() => {
      setHasMore(false);
      setIsLoading(false);
      setError(true);
    });
  }

  useInterval(() => {
    if (hasMore) {
      getPosts(true);
    }
  }, 15000);

  function getInfo() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${userId}`,
      config
    );
    request.then((response) => {
      setUserInfo(response.data.user);
    });
    request.catch((error) => {
      alert(error.response.data.message);
    });
  }

  function getFollows() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows`,
      config
    );
    request.then((response) => {
      const userFollows = response.data.users.filter(
        (item) => item.id === Number(userId)
      );
      if (userFollows.length > 0) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    });
    request.catch((error) => {
      alert(error.response.data.message);
    });
  }
  function follow() {
    setLoadingFollow(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${userId}/follow`,
      {},
      config
    );
    request.then(() => {
      setFollowing(true);
      setLoadingFollow(false);
    });
    request.catch((error) => {
      setLoadingFollow(false);
      alert(`Operation not possible due to ${error.response.data.message}.`);
    });
  }
  function unfollow() {
    setLoadingFollow(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${userId}/unfollow`,
      {},
      config
    );
    request.then(() => {
      setFollowing(false);
      setLoadingFollow(false);
    });
    request.catch((error) => {
      alert(`Operation not possible due to ${error.response.data.message}.`);
      setLoadingFollow(false);
    });
  }
  function removePost(repost, id) {
    let filteredPosts = [];
    if (repost) {
      filteredPosts = posts.filter((p) => p.repostId !== id);
    } else {
      filteredPosts = posts.filter((p) => p.id !== id);
    }
    const refreshPosts = [...filteredPosts];
    setPosts(refreshPosts);
  }
  return (
    <StyledTimeline>
      <Introduction>
        <div>
          <Avatar url={userInfo && userInfo.avatar} />
          {userInfo && <h1>{userInfo.username}'s posts</h1>}
        </div>
        <FollowButton
          onClick={following ? unfollow : follow}
          followinguser={following}
          show={displayButton}
          disabled={loadingFollow}
        >
          {following ? "Unfollow" : "Follow"}
        </FollowButton>
      </Introduction>
      <div className="main-content">
        <div className="page-left">
          {isLoading ? (
            <Loading />
          ) : posts === null || posts === undefined ? (
            error ? (
              <p className="warning">
                Could not get posts right now. Please try again.
              </p>
            ) : (
              ""
            )
          ) : posts.length === 0 ? (
            <p className="warning">This person has not posted yet!</p>
          ) : (
            <PostsList
              posts={posts}
              getPosts={getPosts}
              hasMore={hasMore}
              removePost={removePost}
            />
          )}
        </div>
        <div className="page-right"></div>
      </div>
    </StyledTimeline>
  );
}

const Introduction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 44px;

  > div {
    display: flex;
    width: 100%;
    align-items: center;
    padding-left: 20px;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  > div div {
    margin-right: 18px;
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }
  @media (max-width: 740px) {
    margin-left: 10px;

    > div {
      padding-left: 0px;
    }
    > div div {
      margin-right: 0;
      flex-shrink: 0;
    }
    h1 {
      padding-right: 5px;
    }
    button {
      margin-right: 10px;
    }
  }
  @media (max-width: 600px) {
    flex-direction: column;
    margin-bottom: 10px;
  }
`;

const FollowButton = styled.button`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 112px;
  height: 31px;
  background: ${(props) => (props.followinguser ? "white" : "#1877F2")};
  border-radius: 5px;
  border: none;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => (props.followinguser ? "#1877F2" : "white")};
  font-family: Lato;
  flex-shrink: 0;
  cursor: pointer;

  :disabled {
    filter: brightness(0.7);
  }
`;

const Avatar = styled.div`
  background-image: url(${(props) => props.url});
  width: 50px;
  height: 50px;
  border-radius: 26.5px;
  background-size: cover;
  background-position: center;
  top: 0;
  right: 0;
`;
