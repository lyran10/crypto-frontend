import Container from "react-bootstrap/Container";
import "./styles/bannerAndCarousel.css";
import { Carousels } from "./carousel";

export const Banner = () => {
  return (
    <section>
      <Container className="banner">
        <div className="d-flex justify-content-center flex-column">
          <span
            className="header h1 fw-bolder text-light text-center"
            style={{ marginTop: "100px" }}
          >
            Crypto Currency
          </span>
          <span
            className="h1 text-center"
            style={{ fontSize: "20px", color: "whitesmoke" }}
          >
            Get all info regarding your favourite crypto currency
          </span>
        </div>
        <div>
          <Carousels />
        </div>
      </Container>
    </section>
  );
};
