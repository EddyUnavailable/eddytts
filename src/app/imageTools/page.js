import styles from '../css/imageTools.module.css';

const tools = [
  {
    name: 'Craiyon',
    link: 'https://www.craiyon.com/',
    api: 'No',
    signUp: 'No',
    usage: 'Unlimited',
    description: 'Formerly DALL·E mini, free image generation in-browser.',
  },
  {
    name: 'Playground AI',
    link: 'https://playgroundai.com/',
    api: 'No',
    signUp: 'Yes',
    usage: '1000+ images/day (free tier)',
    description: 'Great for artistic and photo-realistic generations.',
  },
  {
    name: 'Mage.Space',
    link: 'https://www.mage.space/',
    api: 'No',
    signUp: 'Optional',
    usage: 'Unlimited (rate-limited)',
    description: 'Free Stable Diffusion interface, no login needed.',
  },
  {
    name: 'Leonardo.Ai',
    link: 'https://leonardo.ai/',
    api: 'Yes (Beta)',
    signUp: 'Yes',
    usage: '150 credits/day (free)',
    description: 'Highly creative AI image tool with prompt control.',
  },
  {
    name: 'Bing Image Creator',
    link: 'https://www.bing.com/images/create/',
    api: 'No',
    signUp: 'Yes (Microsoft)',
    usage: '15 boosts/day',
    description: 'Powered by DALL·E 3 via Microsoft Copilot.',
  },
  {
    name: 'NightCafe Studio',
    link: 'https://creator.nightcafe.studio/',
    api: 'Yes (paid)',
    signUp: 'Yes',
    usage: '5 free credits/day',
    description: 'Multiple models with community and style options.',
  },
  {
    name: 'Pixray',
    link: 'https://pixray.gob.io/',
    api: 'No',
    signUp: 'No',
    usage: 'Unlimited (slow)',
    description: 'Open-source tool with text-to-image capabilities.',
  },
  {
    name: 'DeepAI',
    link: 'https://deepai.org/machine-learning-model/text2img',
    api: 'Yes',
    signUp: 'No',
    usage: 'Free with limits',
    description: 'Simple text-to-image API with example UI.',
  },
  {
    name: 'Artbreeder',
    link: 'https://www.artbreeder.com/',
    api: 'No',
    signUp: 'Yes',
    usage: 'Limited (upgrade for more)',
    description: 'Collaborative AI image remix platform.',
  },
  {
    name: 'Stablecog',
    link: 'https://stablecog.com/',
    api: 'No',
    signUp: 'Yes',
    usage: '300 images/month (free)',
    description: 'Slick UI for generating high-quality images.',
  },
];

export default function ImageToolsPage() {
  return (
    <div>
      <h1>Top 10 Free AI Image Generators</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>API</th>
            <th>Sign Up</th>
            <th>Usage Allowance</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.name}>
              <td>{tool.name}</td>
              <td><a href={tool.link} target="_blank" rel="noopener noreferrer">Visit</a></td>
              <td>{tool.api}</td>
              <td>{tool.signUp}</td>
              <td>{tool.usage}</td>
              <td>{tool.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}