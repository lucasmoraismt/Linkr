import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../../contexts/UserContexts";

export default function SignUp() {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.user) {
      const userStorage = JSON.parse(localStorage.user);
      setUser(userStorage);
      history.push("/timeline");
    }
  }, [user]);

  function newUser(event) {
    event.preventDefault();
    if (
      validateEmail(email) &&
      password.trim().length > 0 &&
      name.trim().length > 0 &&
      isURL(image)
    ) {
      setLoading(true);
      const body = {
        email,
        password,
        username: name,
        pictureUrl: image,
      };
      const request = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/sign-up",
        body
      );
      request.then((response) => {
        history.push("/");
      });

      request.catch((error) => {
        if (error.response.status === 403) {
          alert("Registration error. Email already registered.");
        } else {
          if (error.response.data.message) {
            alert(
              `Registration error. ${error.response.data.message}. Please try again.`
            );
          } else {
            alert("Registration error. Please try again.");
          }
        }
        setLoading(false);
      });
    } else {
      if (!validateEmail(email)) {
        alert("Please check your email.");
        return;
      }
      if (!isURL(image)) {
        alert("Please check your image URL.");
        return;
      }
      if (password.trim().length === 0) {
        alert("Plase type a password.");
        return;
      }
      if (name.trim().length === 0) {
        alert("Please type your name.");
      }
    }
  }
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function isURL(url) {
    const re =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return re.test(String(url).toLowerCase());
  }

  return (
    <Container>
      <Introduction>
        <p className="page-title">linkr</p>
        <p className="page-subtitle">
          save, share and discover the best links on the web
        </p>
      </Introduction>
      <FormContainer>
        <Form onSubmit={newUser}>
          <input
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="e-mail"
            required
          ></input>
          <input
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="password"
            required
          ></input>
          <input
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="username"
            required
          ></input>
          <input
            disabled={loading}
            onChange={(e) => setImage(e.target.value)}
            value={image}
            type="url"
            placeholder="picture url"
            required
          ></input>
          <button disabled={loading} type="submit">
            {loading ? <>Signing Up...</> : <>Sign Up</>}
          </button>
        </Form>
        <StyledLink to="/">
          <p>Switch back to log in</p>
        </StyledLink>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;

  @media (max-width: 740px) {
    flex-direction: column;
  }
`;
const Introduction = styled.div`
  height: 100%;
  width: 60vw;
  background-color: #151515;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  color: #ffffff;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  padding-left: 5vw;
  padding-right: 20px;

  .page-title {
    font-family: Passion One;
    font-size: 106px;
    line-height: 117px;
    letter-spacing: 0.05em;
  }
  .page-subtitle {
    max-width: 445px;
    font-family: Oswald;
    font-size: 43px;
    line-height: 64px;
  }

  @media (max-width: 740px) {
    width: 100%;
    height: 165px;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0px 0px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding-bottom: 30px;

    .page-title {
      margin: 0px auto;
      font-size: 76px;
      line-height: 76px;
      letter-spacing: 0.05em;
    }
    .page-subtitle {
      margin: 0px auto;
      max-width: 240px;
      font-size: 23px;
      line-height: 30px;
    }
  }
`;

const FormContainer = styled.div`
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 4%;
  padding-left: 4%;

  @media (max-width: 740px) {
    padding-right: 8%;
    padding-left: 8%;
    width: 100vw;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: Oswald;
  font-weight: bold;

  input {
    width: 100%;
    height: 65px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 15px;
    color: #151515;
    border: none;
    margin-bottom: 13px;
    font-size: 27px;
    line-height: 40px;
  }
  input:disabled {
    filter: brightness(0.7);
  }
  input::placeholder {
    font-size: 27px;
    line-height: 40px;
    color: #9f9f9f;
  }
  button {
    width: 100%;
    height: 65px;
    background: #1877f2;
    border-radius: 6px;
    border: none;
    font-size: 27px;
    line-height: 40px;
    color: #ffffff;
  }
  button:disabled {
    filter: brightness(0.7);
  }

  @media (max-width: 740px) {
    margin-top: 20px;

    input {
      height: 55px;
      font-size: 22px;
      line-height: 33px;
    }
    input::placeholder {
      font-size: 22px;
      line-height: 33px;
    }
  }
`;

const StyledLink = styled(Link)`
  margin-top: 10px;
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  p {
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
    text-decoration-line: underline;
    color: #ffffff;
  }

  @media (max-width: 740px) {
    font-size: 17px;
    line-height: 20px;
    margin-bottom: 20px;
  }
`;
