import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { FavoritePage } from "../pages/FavPage";
import "@testing-library/jest-dom";

const mockFavorites = [
  {
    id: 1,
    title: "Inception",
    posterPath: "/inception.jpg",
    vote_average: 8.8,
  },
  {
    id: 2,
    title: "Interstellar",
    posterPath: "/interstellar.jpg",
    vote_average: 8.6,
  },
];

describe("FavoritePage", () => {
  beforeEach(() => {
    localStorage.setItem("favorites", JSON.stringify(mockFavorites));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders favorite movies from localStorage", () => {
    render(
      <MemoryRouter>
        <FavoritePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Your Favorite Movies")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  test("removes a movie from favorites when remove button is clicked", () => {
    render(
      <MemoryRouter>
        <FavoritePage />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByTitle("Remove from favorites");
    fireEvent.click(removeButtons[0]); // Remove Inception

    expect(screen.queryByText("Inception")).not.toBeInTheDocument();
    expect(localStorage.getItem("favorites")).not.toContain("Inception");
  });

  test("displays empty state message when no favorites exist", () => {
    localStorage.setItem("favorites", JSON.stringify([]));
    render(
      <MemoryRouter>
        <FavoritePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Your heart is empty... 💔")).toBeInTheDocument();
    expect(screen.getByText("Explore Movies")).toBeInTheDocument();
  });
});
