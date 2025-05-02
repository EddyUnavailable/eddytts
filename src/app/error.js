'use client';

export default function GlobalError({ error, reset }) {
  console.error('Client error:', error); // Client-side logging only

  return (
    <html>
      <body>
        <h1>Something went wrong!</h1>
        <p>{error?.message || 'Unknown error occurred'}</p>
        <button onClick={() => reset()}>Try Again</button>
      </body>
    </html>
  );
}