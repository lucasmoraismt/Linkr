import { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa";
import styled from "styled-components";
import UserContext from "../../contexts/UserContexts";
import axios from "axios";
import Modal from "react-modal";
import "./ModalStyle.css";

Modal.setAppElement("#root");

export default function DeleteButton({ postId, userId, repost, removePost }) {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function deletePost() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const deletePostRequest = axios.delete(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${postId}`,
      config
    );
    setIsLoading(true);
    deletePostRequest.then(() => {
      toggleModal();
      setIsLoading(false);
      removePost(repost, postId);
    });
    deletePostRequest.catch(() => {
      setError(true);
      setIsLoading(false);
    });
  }

  return userId === user.id ? (
    <>
      <TrashButton onClick={toggleModal}>
        <FaTrash />
      </TrashButton>
      <Modal
        className="content"
        overlayClassName="overlay"
        isOpen={isOpen}
        onRequestClose={toggleModal}
      >
        <ModalContent error={error}>
          {error ? (
            <>
              <p>Error: Could not delete your post at this time.</p>
              <div>
                <button
                  className="cancel"
                  onClick={() => {
                    toggleModal();
                    setError(false);
                  }}
                  disabled={isLoading}
                >
                  Ok, go back
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Are you sure you want to delete this post?</p>
              <div>
                <button
                  className="cancel"
                  onClick={toggleModal}
                  disabled={isLoading}
                >
                  No, go back
                </button>
                <button onClick={deletePost} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Yes, delete it"}
                </button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      {isLoading && <Overlay />}
    </>
  ) : (
    ""
  );
}

const TrashButton = styled.button`
  display: flex;
  justify-content: flex-end;
  background-color: transparent;
  color: white;
  border: none;
`;

const ModalContent = styled.div`
  color: white;
  p {
    max-width: 360px;
    font-weight: bold;
    font-size: 34px;
    line-height: 41px;
    margin-bottom: 47px;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.error ? "center" : "space-between")};
    padding: 0px 30px;
    button {
      width: 134px;
      height: 37px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      border: none;
      color: #ffffff;
      background: #1877f2;
    }
    button.cancel {
      background: #ffffff;
      color: #1877f2;
    }
    button:disabled {
      filter: brightness(0.7);
    }
  }
  @media (max-width: 740px) {
    border-radius: 16px;
    p {
      max-width: 100%;
      font-size: 24px;
      margin: 0px 35px 47px;
    }
    div {
      max-width: 360px;
      margin: 0px auto;
      button {
        width: 134px;
        margin: 0px 5px;
      }
    }
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  z-index: 5;
`;
