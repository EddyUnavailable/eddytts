import styles from '../../css/resources.module.css';

export default function TTSList() {
  const ttsProviders = [
    {
      name: 'Google Cloud Text-to-Speech',
      link: 'https://cloud.google.com/text-to-speech',
      api: 'Yes',
      signup: 'Yes',
      usage: '4M characters/month (12 months)',
      description: 'Offers realistic WaveNet and Neural2 voices with SSML support, audio profiles, and more than 40 languages and variants. Extensive integration with other Google Cloud services.',
      pricingNote: 'Free tier for 12 months; paid plans based on usage.',
      unique: 'WaveNet & Neural2 voices, audio profiles, global support.'
    },
    {
      name: 'Amazon Polly',
      link: 'https://aws.amazon.com/polly/',
      api: 'Yes',
      signup: 'Yes',
      usage: '5M characters/month (12 months)',
      description: 'Lifelike neural TTS voices, supports lexicons, speech marks (for lip-sync, captions), and real-time streaming. Tight integration with AWS Lambda and S3.',
      pricingNote: 'Free tier for 12 months; pay-as-you-go afterward.',
      unique: 'Lexicons, speech marks, AWS service integration.'
    },
    {
      name: 'Microsoft Azure TTS',
      link: 'https://azure.microsoft.com/en-us/products/cognitive-services/text-to-speech/',
      api: 'Yes',
      signup: 'Yes',
      usage: '5M characters/month (12 months)',
      description: 'Supports 400+ voices in over 140 languages. Offers fine-tuning with SSML, custom voice training, and real-time streaming.',
      pricingNote: 'Free tier for 12 months with Azure account.',
      unique: 'Custom voice training, multi-language, high voice diversity.'
    },
    {
      name: 'IBM Watson Text to Speech',
      link: 'https://www.ibm.com/cloud/watson-text-to-speech',
      api: 'Yes',
      signup: 'Yes',
      usage: '10,000 characters/month (Free tier)',
      description: 'Provides basic TTS with multilingual support and SSML features. IBM cloud integration, suitable for enterprise use.',
      pricingNote: 'Smaller free tier, usage-based pricing.',
      unique: 'Simple UI, enterprise-focused, easy API.'
    },
    {
      name: 'ElevenLabs',
      link: 'https://www.elevenlabs.io/',
      api: 'Yes',
      signup: 'Yes',
      usage: '~10,000 characters/month (Free)',
      description: 'Offers ultra-realistic voice synthesis, voice cloning, emotion control, and an intuitive voice design tool.',
      pricingNote: 'Free tier is generous; paid tiers for voice cloning.',
      unique: 'Voice cloning, emotion, high realism.'
    },
    {
      name: 'Play.ht',
      link: 'https://play.ht/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Limited free tier',
      description: 'Browser-based interface with 800+ voices, supports SSML, download options, and embeddable audio players.',
      pricingNote: 'Free trial available; subscription needed for full features.',
      unique: 'Embeddable audio, podcast mode, voice styles.'
    },
    {
      name: 'TTSMP3.com',
      link: 'https://ttsmp3.com/',
      api: 'No',
      signup: 'No',
      usage: '3,000 characters/day',
      description: 'Simple online interface supporting multiple languages, tuning for speed/pitch, and MP3 downloads.',
      pricingNote: 'Completely free with daily limit.',
      unique: 'No account needed, basic UI.'
    },
    {
      name: 'Voicemaker.in',
      link: 'https://voicemaker.in/',
      api: 'No',
      signup: 'No',
      usage: '250 characters per use (Free)',
      description: 'Online TTS with voice control (speed, pitch), downloadable output, and support for basic commercial use.',
      pricingNote: 'Limited free usage; subscriptions available.',
      unique: 'Easy tuning, commercial use allowed (paid).'
    },
    {
      name: 'Narakeet',
      link: 'https://www.narakeet.com/',
      api: 'Yes',
      signup: 'Yes',
      usage: '20 slides/videos per month',
      description: 'Converts PowerPoint and scripts into narrated videos using TTS. Useful for e-learning or YouTube voiceovers.',
      pricingNote: 'Free tier for video generation.',
      unique: 'Slide narration, video conversion from TTS.'
    },
    {
      name: 'iSpeech',
      link: 'https://www.ispeech.org/',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Limited use (Free API)',
      description: 'Lightweight API with multilingual support. Includes mobile SDKs for iOS/Android.',
      pricingNote: 'Free for small-scale usage.',
      unique: 'Mobile SDKs, simple API integration.'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Top 10 Free & Freemium TTS Providers</h1>
        <p className={styles.intro}>
          Here's a comparison of top text-to-speech services offering free tiers or APIs. This list includes major cloud providers and indie platforms for quick testing or advanced voice projects.
        </p>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>API</th>
            <th>Signup</th>
            <th>Free Usage</th>
            <th>Features</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ttsProviders.map((provider, index) => (
            <tr key={index}>
              <td><strong>{provider.name}</strong></td>
              <td className={styles.tableCell}>{provider.api}</td>
              <td>{provider.signup}</td>
              <td>{provider.usage}</td>
              <td>
                <div><em>{provider.description}</em></div>
                <div><strong>Highlights:</strong> {provider.unique}</div>
                <div><strong>Note:</strong> {provider.pricingNote}</div>
              </td>
              <td className={styles.tableCell}>
                <a href={provider.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Visit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
