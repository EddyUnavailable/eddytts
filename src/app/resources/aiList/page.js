import styles from '../../css/resources.module.css';

export default function AIList() {
  const aiServices = [
    {
      name: 'ChatGPT (OpenAI)',
      link: 'https://chat.openai.com/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Free (GPT-3.5); Paid (GPT-4)',
      description:
        'Versatile general-purpose AI with strong reasoning, coding, and conversation abilities.',
    },
    {
      name: 'Claude (Anthropic)',
      link: 'https://claude.ai/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Free (Claude Haiku)',
      description:
        'High-quality responses with focus on safety, context length, and fast replies.',
    },
    {
      name: 'Gemini (Google)',
      link: 'https://gemini.google.com/',
      api: 'Yes',
      signup: 'Yes',
      usage: 'Free (Gemini 1.5), Paid for Pro features',
      description:
        'Google’s AI with deep integration into its ecosystem, supports images and tools.',
    },
    {
      name: 'Microsoft Copilot (Bing Chat)',
      link: 'https://copilot.microsoft.com/',
      api: 'No (Uses OpenAI API internally)',
      signup: 'Yes (via Microsoft account)',
      usage: 'Free (GPT-4-turbo)',
      description:
        'Embedded in Edge and Windows, supports web browsing and image understanding.',
    },
    {
      name: 'Perplexity AI',
      link: 'https://www.perplexity.ai/',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Free with limited advanced model access',
      description:
        'AI-powered search assistant with citations, quick facts, and research tools.',
    },
    {
      name: 'HuggingChat (Hugging Face)',
      link: 'https://huggingface.co/chat/',
      api: 'Yes',
      signup: 'No',
      usage: 'Free access to open-source LLMs',
      description:
        'Chat with multiple open models like Mistral, Mixtral, Zephyr.',
    },
    {
      name: 'Pi (Inflection AI)',
      link: 'https://pi.ai/',
      api: 'No',
      signup: 'Yes',
      usage: 'Free (Chat only)',
      description:
        'Emotionally aware AI focused on personal support, coaching, and daily conversation.',
    },
    {
      name: 'You.com AI Chat',
      link: 'https://you.com/chat',
      api: 'Yes',
      signup: 'Optional',
      usage: 'Free; premium options available',
      description:
        'Search-integrated chat with access to web results and tools.',
    },
    {
      name: 'Character.AI',
      link: 'https://beta.character.ai/',
      api: 'No (API in development)',
      signup: 'Yes',
      usage: 'Free (Unlimited chat)',
      description:
        'Roleplay-focused chatbot platform with custom personalities.',
    },
    {
      name: 'Janitor AI',
      link: 'https://janitorai.com/',
      api: 'Yes (Requires external API key)',
      signup: 'Yes',
      usage: 'Free (with user-supplied LLM key)',
      description:
        'Customizable chatbots with roleplaying and NSFW options (user-moderated).',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Top 10 Free AI Chatbots (2025)</h1>
        <p className={styles.intro}>
          A curated list of the most capable and accessible chat-based AIs as of 2025. Some offer APIs, and many support advanced models at no cost.
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
