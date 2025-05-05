// pages/index.js
import styles from '../css/mergeTool.module.css';

const tools = [
  {
    name: 'Canva',
    link: 'https://www.canva.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free tier with limited exports',
    description: 'Online design tool that allows merging MP3s and images into video presentations.'
  },
  {
    name: 'Kapwing',
    link: 'https://www.kapwing.com',
    api: 'Limited',
    signup: 'Optional',
    allowance: 'Free exports with watermark',
    description: 'Online video editor with timeline editing and AI-powered features.'
  },
  {
    name: 'VEED.IO',
    link: 'https://www.veed.io',
    api: 'Limited',
    signup: 'Yes',
    allowance: 'Free with watermark, 720p export',
    description: 'Video editor supporting audio, images, subtitles, and waveform generation.'
  },
  {
    name: 'Clipchamp',
    link: 'https://www.clipchamp.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free tier available, includes watermark',
    description: 'Microsoft-owned video editor supporting image/audio merging in timeline.'
  },
  {
    name: 'Descript',
    link: 'https://www.descript.com',
    api: 'No',
    signup: 'Yes',
    allowance: 'Free plan with limited transcription time',
    description: 'Desktop app for AI-powered video/audio editing and audiogram creation.'
  },
  {
    name: 'Google Photos',
    link: 'https://photos.google.com',
    api: 'No',
    signup: 'Yes (Google account)',
    allowance: 'Unlimited basic use',
    description: 'Photo/movie creation tool with audio background support on mobile and web.'
  },
  {
    name: 'ffmpeg',
    link: 'https://ffmpeg.org',
    api: 'N/A (CLI)',
    signup: 'No',
    allowance: 'Fully free and open-source',
    description: 'Command-line tool to combine images and audio into video files without watermark.'
  },
];

export default function mergeTools() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Free Tools to Merge MP3 and Images</h1>
      <table className={styles.toolTable}>
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
              <td>
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
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
