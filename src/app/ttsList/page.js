import styles from '../css/ttsList.module.css';

export default function ttsList() {
  const ttsProviders = [
    {
      name: 'Google Cloud Text-to-Speech',
      link: 'https://cloud.google.com/text-to-speech',
      api: 'Yes',
      signup: 'Yes',
      usage: '4M characters/month (12 months)',
      description: 'Offers realistic WaveNet voices, supports SSML, and has 40+ languages.'
    },
    {
      name: 'Amazon Polly',
      link: 'https://aws.amazon.com/polly/',
      api: 'Yes',
      signup: 'Yes',
      usage: '5M characters/month (12 months)',
      description: 'Neural TTS with lifelike voices, includes speech marks and lexicons.'
    },
    {
      name: 'Microsoft Azure TTS',
      link: 'https://azure.microsoft.com/en-us/products/cognitive-services/text-to-speech/',
      api: 'Yes',
      signup: 'Yes',
      usage: '5M characters/month (12 months)',
      description: 'Supports 400+ voices with real-time streaming and SSML.'
    },
    {
      name: 'IBM Watson Text to Speech',
      link: 'https://www.ibm.com/cloud/watson-text-to-speech',
      api: 'Yes',
      signup: 'Yes',
      usage: '10,000 characters/month',
      description: 'Offers multiple languages and formats, with solid API documentation.'
    },
    {
      name: 'ElevenLabs',
      link: 'https://www.elevenlabs.io/',
      api: 'Yes',
      signup: 'Yes',
      usage: '~10,000 characters/month (Free tier)',
      description: 'Highly realistic voices, supports cloning and editing.'
    },
    {
      name: 'Play.ht',
      link: 'https://play.ht/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Limited free tier',
      description: 'Web UI with realistic voices and embeddable audio players.'
    },
    {
      name: 'TTSMP3.com',
      link: 'https://ttsmp3.com/',
      api: 'No',
      signup: 'No',
      usage: '3,000 characters/day',
      description: 'Simple, browser-based with multiple languages and voice tuning.'
    },
    {
      name: 'Voicemaker.in',
      link: 'https://voicemaker.in/',
      api: 'No',
      signup: 'No',
      usage: '250 characters per use (Free)',
      description: 'Text tuner with speed, pitch control, and export options.'
    },
    {
      name: 'Narakeet',
      link: 'https://www.narakeet.com/',
      api: 'Yes',
      signup: 'Yes',
      usage: '20 slides/videos per month',
      description: 'Convert slides or scripts to narrated videos with TTS.'
    },
    {
      name: 'iSpeech',
      link: 'https://www.ispeech.org/',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Limited use (Free API)',
      description: 'Has mobile SDKs and a basic TTS API for developers.'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Top 10 Free TTS AI Services</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>API</th>
            <th>Signup</th>
            <th>Usage Allowance</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ttsProviders.map((provider, index) => (
            <tr key={index}>
              <td>{provider.name}</td>
              <td><a href={provider.link} target="_blank" rel="noopener noreferrer">Visit</a></td>
              <td>{provider.api}</td>
              <td>{provider.signup}</td>
              <td>{provider.usage}</td>
              <td>{provider.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
