import styled from "styled-components";

const PostStyle = styled.div`
  background-color: #1e1e1e;
  margin-bottom: 30px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  transition: 0.5s;

  @media (max-width: 740px) {
    border-radius: 0px;
  }

  div.repost {
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    padding: 0px 13px;
    div {
      display: flex;
      align-items: center;
      margin-left: 6px;
      font-size: 11px;
      line-height: 13px;
      svg {
        font-size: 22px;
        margin-right: 5px;
      }
      a {
        margin-left: 3px;
        font-weight: bold;
      }
    }
  }

  .post-content {
    display: flex;
    width: 100%;
    padding: 20px;
    background-color: #171717;
    color: #707070;
    border-radius: 16px;
    font-family: Lato;
    position: relative;
    word-break: break-word;
    div.post-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 11px;
      line-height: 13px;
      text-align: center;
      color: #ffffff;
      width: 67px;

      a.user-image {
        border-radius: 50%;
        margin-bottom: 20px;
        div {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-image: url("${(props) => props.avatar}");
          background-color: #4d4d4d;
          background-size: cover;
          background-position: center;
        }
      }
      svg {
        color: #fff;
        width: 20px;
        height: 18px;
      }
    }

    div.post-right {
      width: calc(100% - 70px);
      margin-left: 15px;
      p {
        margin-bottom: 8px;
      }
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        div {
          display: flex;
        }
      }
      a.username {
        font-size: 19px;
        line-height: 23px;
        color: #fff;
      }
      p.user-text {
        font-size: 17px;
        line-height: 20px;
        word-break: break-word;
        textarea {
          width: 100%;
          min-height: 44px;
          color: #4c4c4c;
          background: #ffffff;
          border-radius: 7px;
          border: none;
          padding: 4px 9px 0px;
          resize: none;
        }
        textarea:disabled {
          filter: brightness(0.7);
        }
      }
      a.hashtag {
        font-weight: bold;
        color: #fff;
      }
      a.link {
        width: 100%;
        border: 1px solid #4d4d4d;
        border-radius: 11px;
        display: flex;
        justify-content: space-between;
        position: relative;

        .texts {
          margin: 15px;
          max-width: calc(100% - 175px);
          p.link-title {
            font-size: 16px;
            line-height: 19px;
            color: #cecece;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p.link-description {
            font-size: 11px;
            line-height: 13px;
            color: #9b9595;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 40px;
          }
          p.link-url {
            font-size: 11px;
            line-height: 13px;
            color: #cecece;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .image {
          background-image: url("${(props) => props.image}");
          background-size: cover;
          background-position: center;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 150px;
          border-radius: 0px 11px 11px 0px;
        }
      }
    }
    @media (max-width: 740px) {
      margin-top: 0px;
      padding: 10px;
      border-radius: 0px;

      div.post-left {
        a.user-image {
          margin-bottom: 15px;
        }
        img {
          height: 40px;
          width: 40px;
        }
        p.likes {
          font-size: 9px;
          line-height: 11px;
        }
      }
      div.post-right {
        width: calc(100% - 50px);
        a.username {
          font-size: 17px;
          line-height: 20px;
        }
        p.user-text {
          font-size: 15px;
          line-height: 18px;
        }
        a.link {
          .texts {
            margin: 8px;
            max-width: calc(100% - 110px);
          }
          p.link-title {
            font-size: 11px;
            line-height: 13px;
          }
          p.link-description {
            font-size: 9px;
            line-height: 11px;
          }
          p.link-url {
            font-size: 9px;
            line-height: 11px;
          }
          .image {
            width: 95px;
          }
        }
      }
    }
  }
  .comment-section {
    position: relative;
    max-height: ${(props) => (props.showingComments ? "600px" : "0px")};
    transition: 0.5s;
    overflow: hidden;
  }
`;

export default PostStyle;
