import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import Post from "./Post";
import "./ModalStyle.css";
import UserContext from "../../contexts/UserContexts";
import { useContext } from "react";

import scrollLoading from "../../assets/scrollLoading.gif";

export default function PostsList({ posts, reload, hasMore, getNewPosts }) {
  const { user } = useContext(UserContext);
  return (
    <Container>
      <InfiniteScroll
        dataLength={posts.length}
        next={reload}
        hasMore={hasMore}
        loader={
          <MorePosts>
            <img src={scrollLoading} />
            <p className="loading-title">Loading more posts...</p>
          </MorePosts>
        }
        endMessage={
          <div className="scrollEnd">
            <p>Yay! You have seen it all</p>
          </div>
        }
      >
        {posts.map((post) => {
          const postKey = post.repostId ? post.repostId : post.id;
          return (
            <Post
              post={post}
              key={postKey}
              reload={reload}
              userId={user.id}
              getNewPosts={getNewPosts}
            />
          );
        })}
      </InfiniteScroll>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  .scrollEnd {
    width: 100%auto;
    display: flex;
    justify-content: center;
    font-family: Lato;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.05em;
    color: #6d6d6d;
    overflow: hidden;
  }
`;

const MorePosts = styled.div`
  margin-top: 30px;
  margin-bottom: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
  }

  .loading-text {
    font-family: Lato;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.05em;
    color: #6d6d6d;
  }
`;
