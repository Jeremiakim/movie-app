import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { TrendingMovies } from "../components/TrendingColumn";

// Mock axios menggunakan Vitest
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockMovies = [
  {
    id: 1,
    title: "Mock Movie 1",
    poster_path: "/mockposter1.jpg",
    vote_average: 8.5,
    release_date: "2024-03-20",
  },
];

describe("TrendingMovies Component", () => {
  const queryClient = new QueryClient();

  test("renders movies after fetching", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { results: mockMovies },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TrendingMovies />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Mock Movie 1")).toBeInTheDocument();
    });
  });

  beforeEach(() => {
    queryClient.clear();
  });

  test("shows error message when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <TrendingMovies />
      </QueryClientProvider>
    );

    expect(
      await screen.findByText(/Error loading movies/i)
    ).toBeInTheDocument();
  });
});
