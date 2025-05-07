// app/components/TestPage.jsx
import { useVoices } from '../api/hooks/useVoices';

const TestPage = () => {
  const { voices, loading, error } = useVoices();

  if (loading) return <div>Loading voices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Voices:</h2>
      <ul>
        {voices.map((voice) => (
          <li key={voice.name} style={{ color: voice.color }}>
            {voice.formattedName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestPage;
