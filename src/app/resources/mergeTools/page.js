import styles from '../../css/resources.module.css';

const tools = [
  {
    name: 'Canva',
    link: 'https://www.canva.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free tier with limited exports',
    description:
      'Online design tool for creating graphics, presentations, and social media posts. You can merge MP3s and images into video presentations with ease.',
  },
  {
    name: 'Kapwing',
    link: 'https://www.kapwing.com',
    api: 'Limited',
    signup: 'Optional',
    allowance: 'Free exports with watermark',
    description:
      'Online video editor with timeline editing and AI-powered features. Offers tools for merging images, audio, and video content for easy video creation.',
  },
  {
    name: 'VEED.IO',
    link: 'https://www.veed.io',
    api: 'Limited',
    signup: 'Yes',
    allowance: 'Free with watermark, 720p export',
    description:
      'A user-friendly online video editor that allows combining images, audio, and text. It includes features for adding subtitles and generating audio waveforms.',
  },
  {
    name: 'Clipchamp',
    link: 'https://www.clipchamp.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free tier available, includes watermark',
    description:
      'Microsoft-owned video editor that enables users to combine images and audio within a timeline. Basic features are available for free, but premium features require a subscription.',
  },
  {
    name: 'Descript',
    link: 'https://www.descript.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free plan with limited transcription time',
    description:
      'AI-powered video and audio editing software. Best known for its transcription features, it can also create audiograms, making it a great tool for content creators.',
  },
  {
    name: 'Google Photos',
    link: 'https://photos.google.com',
    api: 'No',
    signup: 'Yes (Google account)',
    allowance: 'Unlimited basic use',
    description:
      'Google Photos allows users to create photo and movie projects by combining images and audio. It supports basic editing features and is available on mobile and web.',
  },
  {
    name: 'ffmpeg',
    link: 'https://ffmpeg.org',
    api: 'N/A (CLI)',
    signup: 'No',
    allowance: 'Fully free and open-source',
    description:
      'A powerful command-line tool for video and audio processing. It allows merging MP3 files with images to create videos without any watermark, and it supports advanced video editing commands.',
  },
  {
    name: 'Shotcut',
    link: 'https://shotcut.org',
    api: 'No',
    signup: 'No',
    allowance: 'Fully free and open-source',
    description:
      'Open-source video editor that provides a wide range of video editing features. Shotcut supports combining images and audio into a video and includes advanced features like filters, transitions, and multi-track editing.',
  },
  {
    name: 'OpenShot',
    link: 'https://www.openshot.org',
    api: 'No',
    signup: 'No',
    allowance: 'Fully free and open-source',
    description:
      'Another open-source video editor that supports audio and image merging. OpenShot is known for its simplicity and offers drag-and-drop editing with support for 3D animations, transitions, and audio syncing.',
  },
];

export default function MergeTools() {
  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Free Tools to Merge MP3 and Images</h1>
        <p className={styles.intro}>
          This list showcases free tools you can use to combine audio (like MP3s) with images to create video content. Options range from online platforms to downloadable editors.
        </p>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>API</th>
            <th>Sign Up</th>
            <th>Free Tier</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.name}>
              <td>{tool.name}</td>
              <td>
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Visit
                </a>
              </td>
              <td>{tool.api}</td>
              <td>{tool.signup}</td>
              <td>{tool.allowance}</td>
              <td>{tool.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
