import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { MostWatchedMovies } from "../components/MostPopularColumn";

const mockMovies = [
  {
    id: 1,
    title: "Mock Movie 1",
    poster_path: "/mockposter1.jpg",
    vote_average: 8.5,
    release_date: "2024-03-20",
  },
  {
    id: 2,
    title: "Mock Movie 2",
    poster_path: "/mockposter2.jpg",
    vote_average: 7.9,
    release_date: "2024-03-22",
  },
];

vi.mock("axios");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe("MostWatchedMovies Component", () => {
  test("renders loading state", () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MostWatchedMovies />
      </QueryClientProvider>
    );
    expect(screen.getByText(/loading movies/i)).toBeInTheDocument();
  });

  test("renders movies after fetching", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockMovies },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MostWatchedMovies />
      </QueryClientProvider>
    );

    expect(await screen.findByText("Mock Movie 1")).toBeInTheDocument();
    expect(await screen.findByText("Mock Movie 2")).toBeInTheDocument();
  });

  test("shows error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MostWatchedMovies />
      </QueryClientProvider>
    );

    expect(
      await screen.findByText(/error loading movies/i)
    ).toBeInTheDocument();
  });

  test("shows 'No movies found' when API returns empty list", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: [] },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MostWatchedMovies />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/no movies found/i)).toBeInTheDocument();
  });
});
