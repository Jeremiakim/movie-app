import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { RecommendationColumn } from "../components/RecommendColumn";
import "@testing-library/jest-dom";

// 🔹 Mock `useNavigate()`
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// 🔹 Mock `useQuery()`
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("RecommendationColumn", () => {
  it("renders loading state correctly", () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({ isLoading: true });

    render(
      <MemoryRouter>
        <RecommendationColumn />
      </MemoryRouter>
    );

    expect(screen.getAllByTestId("skeleton")).toHaveLength(10);
  });

  describe("RecommendationColumn", () => {
    it("renders recommendations correctly", () => {
      // Setup QueryClient
      const queryClient = new QueryClient();

      (useQuery as jest.Mock).mockReturnValue({
        data: [
          { id: 1, title: "Movie 1", vote_average: 8.5, poster_path: null },
        ],
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        status: "success",
        refetch: vi.fn(),
      });

      // Render komponen
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationColumn />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Assert bahwa "Movie 1" muncul di layar
      expect(screen.getByText("Movie 1")).toBeInTheDocument();
    });
  });

  it("renders error message when query fails", () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
    });

    render(
      <MemoryRouter>
        <RecommendationColumn />
      </MemoryRouter>
    );

    expect(screen.getByText("Your Connection Is Lost")).toBeInTheDocument();
  });

  it("renders empty state when no recommendations available", () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <RecommendationColumn />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No Recommendations Available")
    ).toBeInTheDocument();
  });
});
