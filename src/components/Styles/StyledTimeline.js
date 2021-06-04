import styled from "styled-components";

const StyledTimeline = styled.div`
  width: 100%;
  max-width: 945px;
  padding: 0px 5px;
  margin: 125px auto 0px;
  h1 {
    font-family: Oswald;
    font-weight: bold;
    font-size: 43px;
    line-height: 64px;
    margin-bottom: 43px;
  }
  .main-content {
    display: flex;
    width: 100%;

    .page-left {
      display: flex;
      flex-direction: column;
      width: 100%;
      .warning {
        margin: 15px;
        font-family: "Oswald", sans-serif;
        font-size: 20px;
      }
    }
    .page-right {
      margin-left: 25px;
      width: 300px;
      flex-shrink: 0;

      @media (max-width: 740px) {
        display: none;
      }
    }
  }
  @media (max-width: 740px) {
    margin: 90px auto 0px;
    padding: 0px;
    h1 {
      padding-left: 17px;
      margin-bottom: 19px;
      font-size: 33px;
    }
  }
  @media (max-width: 600px) {
    margin-top: 125px;
  }
`;

export default StyledTimeline;
