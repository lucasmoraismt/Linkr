import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContexts";

import Loading from "../Loading/Loading";
import StyledTimeline from "../Styles/StyledTimeline";
import PostsList from "../Timeline/PostsList";

export default function LikedPosts() {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [user]);

  function getPosts(earlier, reset) {
    if (earlier || reset) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    let url = `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked`;
    if (posts && posts.length > 0) {
      url = `${url}?offset=${posts.length}`;
    }
    const request = axios.get(url, config);
    let refreshPosts;
    request.then((response) => {
      refreshPosts = posts
        ? [...posts, ...response.data.posts]
        : [...response.data.posts];
      if (response.data.posts.length < 10) {
        setHasMore(false);
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
      <h1>my likes</h1>
      <div className="main-content">
        <div className="page-left">
          {isLoading ? (
            <Loading />
          ) : posts === null ? (
            error ? (
              <p className="warning">
                Could not get posts right now. Please try again.
              </p>
            ) : (
              ""
            )
          ) : posts.length === 0 ? (
            <p className="warning">No liked posts yet!</p>
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
