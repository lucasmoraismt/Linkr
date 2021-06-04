import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../../contexts/UserContexts";

export default function Trending() {
  const { user } = useContext(UserContext);
  const [trending, setTrending] = useState([]);
  const [requestError, setRequestError] = useState(false);
  const [hashtag, setHashtag] = useState("");
  const history = useHistory();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const location = useLocation();

  useEffect(() => {
    if (user) {
      getTrending();
    }
  }, [user]);

  useEffect(() => {
    if (Date.now() - lastUpdate > 60000) {
      setLastUpdate(Date.now());
      getTrending();
    }
  }, [location]);

  function getTrending() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.get(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/trending",
      config
    );
    request.then((response) => {
      setTrending(response.data.hashtags);
      setRequestError(false);
    });
    setRequestError(false);
    request.catch(() => {
      setRequestError(true);
    });
  }

  function goToHashtag(e) {
    e.preventDefault();
    if (!hashtag) {
      return;
    }
    history.push(`/hashtag/${hashtag}`);
  }

  return (
    <TrendingContainer>
      <div>
        <p className="title">trending</p>
        <ContainerList>
          {!requestError ? (
            trending.length > 0 ? (
              trending.map((item) => (
                <Link key={item.id} to={`/hashtag/${item.name}`}>
                  # {item.name}
                </Link>
              ))
            ) : (
              <>Loading...</>
            )
          ) : (
            <a href="#" onClick={getTrending}>
              <p>Could not get trending.</p>
              <p>Try again?</p>
            </a>
          )}
        </ContainerList>
        <form onSubmit={goToHashtag}>
          <span>#</span>
          <input
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value.replace(/[\W_]+/, ""))}
            type="text"
            placeholder="type a hashtag"
          />
        </form>
      </div>
    </TrendingContainer>
  );
}

const TrendingContainer = styled.div`
  position: fixed;
  top: 232px;
  right: calc((100% - 945px) / 2 + 5px);
  & > div {
    font-weight: bold;
    width: 300px;
    background-color: #171717;
    border-radius: 16px;

    .title {
      font-family: "Oswald", sans-serif;
      font-size: 27px;
      line-height: 40px;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0px 16px;
      border-bottom: 1px solid #484848;
    }
    form {
      padding: 0px 16px 15px;
      display: flex;
      align-items: center;
      span {
        position: absolute;
        font-size: 19px;
        left: 29px;
      }
      input {
        font-family: Lato;
        font-weight: normal;
        font-size: 16px;
        letter-spacing: 0.05em;
        color: white;
        height: 35px;
        background: #252525;
        border-radius: 8px;
        width: 100%;
        border: none;
        padding: 0px 12px 0px 36px;
      }
      input::placeholder {
        color: #575757;
        font-style: italic;
        opacity: 1;
      }
    }
  }
  @media (max-height: 640px) {
    top: initial;
    bottom: 0;
  }
  @media (max-width: 950px) {
    right: 5px;
  }
  @media (max-width: 740px) {
    display: none;
  }
`;

const ContainerList = styled.div`
  font-family: "Lato", sans-serif;
  font-size: 19px;
  line-height: 23px;
  letter-spacing: 0.05em;
  padding: 24px 16px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 330px;
  a {
    margin-bottom: 5px;
    width: fit-content;
  }
`;
