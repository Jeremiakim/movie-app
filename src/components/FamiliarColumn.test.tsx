import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FamiliarColumn } from "./FamiliarColumn";
import "@testing-library/jest-dom";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("FamiliarColumn Component", () => {
  test("renders loading state with Skeletons", () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={["/moviedetail/1"]}>
          <Routes>
            <Route path="/moviedetail/:movieId" element={<FamiliarColumn />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getAllByTestId("skeleton")).toHaveLength(5);
  });

  test("renders movies after fetching", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            title: "Mock Movie 1",
            poster_path: "/mockposter1.jpg",
            vote_average: 8.5,
          },
        ],
      },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={["/moviedetail/1"]}>
          <Routes>
            <Route path="/moviedetail/:movieId" element={<FamiliarColumn />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Mock Movie 1")).toBeInTheDocument();
    });
  });

  test("shows error message when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={["/moviedetail/1"]}>
          <Routes>
            <Route path="/moviedetail/:movieId" element={<FamiliarColumn />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/film not found/i)).toBeInTheDocument();
  });

  test("shows 'Film Not Found' when API returns empty list", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={["/moviedetail/1"]}>
          <Routes>
            <Route path="/moviedetail/:movieId" element={<FamiliarColumn />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/film not found/i)).toBeInTheDocument();
  });
});
