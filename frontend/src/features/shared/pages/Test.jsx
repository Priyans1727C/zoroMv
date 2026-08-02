import { useState } from "react";
import { useMoviesByPage } from "../../home/hooks/useHome";

export default function Test() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMoviesByPage("popular", page);

  if (isLoading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Error</h2>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>TanStack Pagination Test</h1>

      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <p>
          <strong>Current Page:</strong> {data?.page}
        </p>

        <p>
          <strong>Total Pages:</strong> {data?.total_pages}
        </p>

        <p>
          <strong>Total Results:</strong> {data?.total_results}
        </p>

        <p>
          <strong>Fetching:</strong> {isFetching ? "Yes" : "No"}
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isFetching}
        >
          ← Previous
        </button>

        <span
          style={{
            margin: "0 20px",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages || isFetching}
        >
          Next →
        </button>
      </div>

      <hr />

      <h2>
        Movies ({data?.results?.length ?? 0})
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: 16,
        }}
      >
        {data?.results?.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h3>{movie.title}</h3>

            <p>ID: {movie.id}</p>

            {movie.releaseDate && (
              <p>Release: {movie.releaseDate}</p>
            )}

            {movie.rating && (
              <p>⭐ {movie.rating}</p>
            )}

            <p
              style={{
                fontSize: 14,
                color: "#666",
              }}
            >
              {movie.overview?.slice(0, 120)}...
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isFetching}
        >
          Previous
        </button>

        <span>
          {page} / {data?.total_pages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages || isFetching}
        >
          Next
        </button>
      </div>
    </div>
  );
}