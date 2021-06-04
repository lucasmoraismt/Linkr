import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from "../../contexts/UserContexts";

import "../../css/reset.css";
import "../../css/styles.css";
import GlobalStyle from "../Styles/GlobalStyle";

import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Timeline from "../Timeline/Timeline";
import MyPosts from "../MyPosts/MyPosts";
import LikedPosts from "../LikedPosts/LikedPosts";
import Header from "../Header/Header";
import HashtagPage from "../HashtagPage/HashtagPage";
import UserPage from "../UserPage/UserPage";
import Trending from "../Trending/Trending";
import SearchBar from "../SearchBar/SearchBar";

export default function App() {
  const [user, setUser] = useState();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GlobalStyle />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/sign-up" exact>
            <SignUp />
          </Route>
          <Route path="/timeline" exact>
            <Header />
            <SearchBar />
            <Timeline />
            <Trending />
          </Route>
          <Route path="/my-posts" exact>
            <Header />
            <SearchBar />
            <MyPosts />
            <Trending />
          </Route>
          <Route path="/my-likes" exact>
            <Header />
            <SearchBar />
            <LikedPosts />
            <Trending />
          </Route>
          <Route path="/user/:userId" exact>
            <Header />
            <SearchBar />
            <UserPage />
            <Trending />
          </Route>
          <Route path="/hashtag/:hashtag" exact>
            <Header />
            <SearchBar />
            <HashtagPage />
            <Trending />
          </Route>
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
