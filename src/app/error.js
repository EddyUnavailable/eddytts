'use client';

export default function GlobalError({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error?.message || 'Unknown error occurred'}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}