import styled from "styled-components";
import { HiSearch } from "react-icons/hi";
import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import UserContext from "../../contexts/UserContexts";
import { DebounceInput } from "react-debounce-input";

export default function SearchBar() {
  const { user } = useContext(UserContext);
  const [orderedUsers, setOrderedUsers] = useState();
  const [tab, setTab] = useState(false);
  const [input, setInput] = useState(false);
  const [userInput, setUserInput] = useState("");
  function searchPeople(text) {
    if (text.trim().length < 3) {
      return;
    }
    let param = text;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const request = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/search?username=${param}`,
      config
    );
    request.then((response) => {
      setTab(true);
      const iFollowArray = response.data.users.filter(
        (item) => item.isFollowingLoggedUser
      );
      const iDontFollowArray = response.data.users.filter(
        (item) => !item.isFollowingLoggedUser
      );
      setOrderedUsers(iFollowArray.concat(iDontFollowArray));
    });
    request.catch((error) => alert(error.response.data.message));
  }
  function onFocusInput() {
    setInput(true);
  }
  function onBlurInput() {
    setTimeout(() => {
      setInput(false);
    }, 100);
  }
  function resetSearch() {
    setUserInput("");
    setOrderedUsers(null);
    setTab(false);
  }

  return (
    <Container>
      <ContainerSupport>
        <ContainerSearch
          onSubmit={(e) => e.preventDefault()}
          inputStatus={input}
          tabStatus={tab}
        >
          <form>
            <DebounceInput
              className="search-input"
              onSubmit={searchPeople}
              placeholder="Search for people and friends"
              onBlur={() => {
                onBlurInput();
              }}
              onKeyDown={(e) => e.key === "Escape" && e.target.blur()}
              onFocus={onFocusInput}
              debounceTimeout={500}
              onChange={(event) => {
                setUserInput(event.target.value);
                searchPeople(event.target.value);
              }}
              type="text"
              value={userInput}
            />
            <div>
              <button type="button">
                <HiSearch color="#C6C6C6" className="icon" />
              </button>
            </div>
          </form>
        </ContainerSearch>
        <ContainerShow tabStatus={tab} inputStatus={input}>
          {orderedUsers && orderedUsers.length === 0 ? (
            <p>No users found</p>
          ) : null}
          {orderedUsers
            ? orderedUsers.map((item) => (
                <Link
                  key={item.id}
                  to={`/user/${item.id}`}
                  onClick={resetSearch}
                >
                  <Avatar url={item.avatar} />
                  <div>
                    <div>{item.username}</div>
                    <div>
                      {item.isFollowingLoggedUser ? (
                        <div>● following</div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))
            : null}
        </ContainerShow>
      </ContainerSupport>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e7e7e7;
  @media (max-width: 600px) {
    position: absolute;
    top: 70px;
    z-index: 1;
  }
`;

const ContainerSupport = styled.div`
  position: absolute;
  top: 12px;
  border-radius: 8px 8px 0 0;
`;

const ContainerShow = styled.div`
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0);
  display: ${(props) => (props.inputStatus ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
  max-height: 70vh;
  overflow: auto;
  color: #6d6d6d;
  border-radius: 0 0 8px 8px;
  background-color: #e7e7e7;
  padding: ${(props) => (props.tabStatus ? "17px" : "0")};

  > a {
    padding: 4px 0;
    display: flex;
    align-items: center;

    > div {
      display: flex;
      align-items: center;
      font-family: Lato;
      font-size: 19px;
      line-height: 23px;
      color: #515151;

      div {
        margin-left: 10px;
      }

      div:last-of-type {
        color: #c5c5c5;
      }
    }
  }
`;

const ContainerSearch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px 8px 0 0;

  .search-input {
    width: 563px;
    height: 45px;
    background: #ffffff;
    border-radius: 8px 0 0 8px;
    border: none;
    padding-left: 17px;
    font-family: Lato;
    font-size: 19px;
    line-height: 23px;

    ::placeholder {
      color: #c6c6c6;
    }
    :focus {
      outline: none;
    }
    @media (max-width: 860px) {
      width: 100%;
    }
  }

  > form {
    border-radius: 8px 8px
      ${(props) => (props.inputStatus ? "0px 0px" : "8px 8px")};
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: ${(props) =>
      props.tabStatus ? "#e7e7e7" : "transparent"};

    > div {
      background-color: white;
      width: 35px;
      display: flex;
      height: 45px;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      border-radius: 0 8px 8px 0;

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: none;
        width: 32px;
      }
    }
  }

  @media (max-width: 860px) {
    width: 300px;
    > div {
      margin-right: 5px;
    }
  }
  @media (max-width: 600px) {
    width: calc(100vw - 20px);
  }
`;

const Avatar = styled.div`
  background-image: url(${(props) => props.url});
  width: 40px;
  height: 40px;
  border-radius: 26.5px;
  background-size: cover;
  background-position: center;
  top: 0;
  right: 0;
  margin-right: 4px;
`;
