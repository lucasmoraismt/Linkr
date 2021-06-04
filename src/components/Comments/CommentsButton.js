import { AiOutlineComment } from "react-icons/ai";
import styled from "styled-components";

export default function CommentsButton({
  counter,
  loadedComments,
  setLoadedComments,
  showingComments,
  setShowingComments,
}) {
  function toggleComments() {
    if (!loadedComments) {
      setLoadedComments(true);
    }
    setShowingComments(!showingComments);
  }

  return (
    <StyledComments onClick={toggleComments}>
      <AiOutlineComment />
      <p>
        {counter} comment{counter > 0 ? "s" : null}
      </p>
    </StyledComments>
  );
}

const StyledComments = styled.button`
  margin-top: 15px;
  width: 100%;
  padding: 0;
  border: none;
  background-color: transparent;
  color: inherit;
`;
