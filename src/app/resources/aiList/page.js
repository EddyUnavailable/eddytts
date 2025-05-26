import styles from '../../css/resources.module.css';

export default function AIList() {
  const aiServices = [
    {
      name: 'Grok 3 (xAI)',
      link: 'https://grok.com/',
      api: 'Yes (via https://x.ai/api)',
      signup: 'Optional (via X account for higher quotas)',
      usage: 'Free (with usage quotas); Paid (SuperGrok for higher quotas)',
      description:
        'Advanced AI with strong reasoning and truth-seeking capabilities, accessible via web and mobile apps.',
    },
    {
      name: 'ChatGPT (OpenAI)',
      link: 'https://chat.openai.com/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Free (GPT-3.5); Paid (GPT-4o, o1)',
      description:
        'Versatile AI for conversation, coding, and reasoning with robust performance across tasks.',
    },
    {
      name: 'Claude (Anthropic)',
      link: 'https://www.anthropic.com/claude',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Free (limited access); Paid (Claude 3.5 Sonnet, Opus)',
      description:
        'Safe, context-aware AI with strong language understanding and fast responses.',
    },
    {
      name: 'Gemini (Google)',
      link: 'https://gemini.google.com/',
      api: 'Yes (via Google AI Studio)',
      signup: 'Yes (Google account)',
      usage: 'Free (Gemini 1.5 Flash); Paid (Gemini 1.5 Pro)',
      description:
        'Google’s AI with multimodal capabilities, integrated with Google’s ecosystem.',
    },
    {
      name: 'Microsoft Copilot',
      link: 'https://copilot.microsoft.com/',
      api: 'No',
      signup: 'Yes (Microsoft account)',
      usage: 'Free (powered by GPT-4o)',
      description:
        'AI assistant in Edge and Windows, offering web search and productivity tools.',
    },
    {
      name: 'Perplexity AI',
      link: 'https://www.perplexity.ai/',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Free (limited queries); Paid (Pro plan)',
      description:
        'AI search assistant with real-time web access and cited responses.',
    },
    {
      name: 'HuggingChat (Hugging Face)',
      link: 'https://huggingface.co/chat/',
      api: 'Yes (via Hugging Face models)',
      signup: 'No',
      usage: 'Free (open-source models)',
      description:
        'Open-source chatbot platform with models like Mixtral and Llama.',
    },
    {
      name: 'Pi (Inflection AI)',
      link: 'https://pi.ai/',
      api: 'No',
      signup: 'Yes',
      usage: 'Free',
      description:
        'Emotionally intelligent AI for personal support and casual conversation.',
    },
    {
      name: 'You.com AI Chat',
      link: 'https://you.com/',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Free; Paid (premium features)',
      description:
        'Search-integrated AI with web results and customizable assistants.',
    },
    {
      name: 'Character.AI',
      link: 'https://www.character.ai/',
      api: 'No',
      signup: 'Yes',
      usage: 'Free (unlimited chat); Paid (C.AI+ for priority)',
      description:
        'Roleplay-focused platform with customizable AI characters.',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Top 10 Free AI Chatbots (2025)</h1>
        <p className={styles.intro}>
          A curated list of the most capable and accessible chat-based AIs as of May 2025. All offer free access with optional paid plans for advanced features. Information verified for accuracy.
        </p>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>API</th>
            <th>Signup</th>
            <th>Usage</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {aiServices.map((service) => (
            <tr key={service.name}>
              <td>{service.name}</td>
              <td>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Visit
                </a>
              </td>
              <td>{service.api}</td>
              <td>{service.signup}</td>
              <td>{service.usage}</td>
              <td>{service.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}