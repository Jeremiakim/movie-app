import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { FTWMovies } from "../components/FTWColumn";

const mockMovies = [
  {
    id: 1,
    title: "Mock Movie 1",
    poster_path: "/mockposter1.jpg",
    vote_average: 8.5,
    release_date: "2024-03-20",
  },
];

vi.mock("axios");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("FTWMovies Component", () => {
  test("renders movies after fetching", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockMovies },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FTWMovies />
      </QueryClientProvider>
    );

    expect(await screen.findByText("Mock Movie 1")).toBeInTheDocument();
  });

  test("shows error message when API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FTWMovies />
      </QueryClientProvider>
    );

    expect(
      await screen.findByText(/Error loading movies/i)
    ).toBeInTheDocument();
  });
});
