import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import UserContext from "../../contexts/UserContexts";

import Loading from "../Loading/Loading";
import StyledTimeline from "../Styles/StyledTimeline";
import PostsList from "../Timeline/PostsList";
import useInterval from "../useInterval/useInterval";

export default function HashtagPage() {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);
  const { hashtag } = useParams();

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getPosts(true, true);
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hashtag]);

  function getPosts(earlier, reset) {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    let url = `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/${hashtag}/posts`;
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
      <h1># {hashtag}</h1>
      <div className="main-content">
        <div className="page-left">
          {isLoading ? (
            <Loading />
          ) : posts === undefined ? (
            error ? (
              <p className="warning">Error getting posts, please try again.</p>
            ) : (
              ""
            )
          ) : posts.length === 0 ? (
            <p className="warning">No posts with this hashtag.</p>
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
