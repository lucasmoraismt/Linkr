import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../../contexts/UserContexts";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      if (localStorage.user) {
        const userStorage = JSON.parse(localStorage.user);
        setUser(userStorage);
        return;
      } else {
        history.push("/");
        return;
      }
    }
    if (user) {
      setAvatar(user ? user.avatar : "");
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
  }, [user]);

  function toggleMenu(e) {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }

  function logOut() {
    localStorage.removeItem("user");
    setUser("");
    history.push("/");
  }

  return (
    <>
      <LoadingOverlay user={user} isLoading={isLoading} />
      <StyledHeader>
        <Link to="/timeline">
          <Logo>linkr</Logo>
        </Link>
        <ShowMenuButton onClick={toggleMenu}>
          <Chevron isMenuOpen={isMenuOpen} /> <UserImage avatar={avatar} />
        </ShowMenuButton>
      </StyledHeader>
      <HeaderOverlay isMenuOpen={isMenuOpen} onClick={toggleMenu} />
      <ContentOverlay isMenuOpen={isMenuOpen} onClick={toggleMenu} />
      <Menu isMenuOpen={isMenuOpen}>
        <li onClick={toggleMenu}>
          <Link to="/my-posts">My Posts</Link>
        </li>
        <li onClick={toggleMenu}>
          <Link to="/my-likes">My Likes</Link>
        </li>
        <li onClick={toggleMenu}>
          <div onClick={logOut}>Logout</div>
        </li>
      </Menu>
    </>
  );
}
const LoadingOverlay = styled.div`
  top: 0;
  bottom: 0px;
  left: 0;
  right: 0;
  transition: 0.5s;
  z-index: 10;
  position: fixed;
  background-color: #333333;
  opacity: ${(props) => (props.user ? "0" : "1")};
  display: ${(props) => (props.isLoading ? "block" : "none")};
`;
const Logo = styled.h1`
  font-family: Passion One;
  font-weight: bold;
  font-size: 49px;
  letter-spacing: 2px;
`;
const ContentOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${(props) => (props.isMenuOpen ? "block" : "none")};
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
`;
const UserImage = styled.div`
  border-radius: 50%;
  margin-left: 26px;
  width: 53px;
  height: 53px;
  background-image: url("${(props) => props.avatar}");
  background-color: #4d4d4d;
  background-size: cover;
  background-position: center;
`;
const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  padding: 0px 16px;
  background-color: #151515;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
`;
const HeaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 130px;
  height: 72px;
  display: ${(props) => (props.isMenuOpen ? "block" : "none")};
  z-index: 4;
`;

const ShowMenuButton = styled.button`
  height: 100%;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Chevron = styled.div`
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  transform: rotate(${(props) => (props.isMenuOpen ? "225" : "45")}deg);
  transition: 0.5s;
`;

const Menu = styled.ul`
  background-color: #151515;
  width: 150px;
  position: fixed;
  top: ${(props) => (props.isMenuOpen ? "72px" : "-50px")};
  right: -20px;
  transition: 0.5s;
  font-weight: bold;
  font-size: 17px;
  line-height: 20px;
  border-radius: 0px 0px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-right: 20px;
  z-index: 2;
  li {
    width: 100%;
    div,
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 5px 0px 10px;
      cursor: pointer;
    }
  }
`;
