import { render, screen, cleanup } from "@testing-library/react";
import Home from "./home/Home.jsx";

describe(Home, () => {
  it("displays the page", () => {
    const {} = render(<Home />);
  });
});
