import React from "react";
import { render, screen } from "@testing-library/react";
import { Movies } from "../components/Movies";
import { createInjected, injectedContext } from "..";

test("Starting components loaded successfully", () => {
  const injected = createInjected();
  render(
    <injectedContext.Provider value={injected}>
      <Movies/>
    </injectedContext.Provider>
  );

  const headerText = screen.getByText("TMBD Movie Search");
  const titleSearchInput = screen.getByPlaceholderText("Movie title...");
  const searchButton = screen.getByText("Search");

  expect(headerText).toBeInTheDocument();
  expect(titleSearchInput).toBeInTheDocument();
  expect(searchButton).toBeInTheDocument();
});