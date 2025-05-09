import React from 'react';
import styles from '../css/ssml.module.css';  // Import the CSS Module

const SSMLPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SSML (Speech Synthesis Markup Language) Guide</h1>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>What is SSML?</h2>
        <p className={styles.paragraph}>
          SSML (Speech Synthesis Markup Language) allows you to control the prosody (rhythm, pitch, and tempo)
          of speech synthesis. With SSML, you can adjust voice characteristics such as speed, pitch, volume, and more.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>Basic SSML Tags</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <code>&lt;speak&gt;</code>: The root element for SSML.
            <pre className={styles.example}>
              {'<speak> Hello, world! </speak>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;break time="500ms"&gt;</code>: Insert a pause in the speech.
            <pre className={styles.example}>
              {'<break time="500ms"/>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;prosody rate="fast"&gt;</code>: Control pitch, rate, and volume of speech.
            <pre className={styles.example}>
              {'<prosody rate="fast">This is a test.</prosody>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;emphasis level="strong"&gt;</code>: Emphasize words.
            <pre className={styles.example}>
              {'<emphasis level="strong">This is important.</emphasis>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;voice name="en-US-Wavenet-D"&gt;</code>: Specify a voice.
            <pre className={styles.example}>
              {'<voice name="en-US-Wavenet-D">Hello!</voice>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;lang xml:lang="es-ES"&gt;</code>: Specify the language.
            <pre className={styles.example}>
              {'<lang xml:lang="es-ES">Hola, ¿cómo estás?</lang>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;phoneme alphabet="ipa" ph="hɪ ˈnɑːm"&gt;</code>: Control phonetic pronunciation.
            <pre className={styles.example}>
              {'<phoneme alphabet="ipa" ph="hɪ ˈnɑːm">Hi, my name is John.</phoneme>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;say-as interpret-as="date"&gt;</code>: Interpret the text as a date.
            <pre className={styles.example}>
              {'<say-as interpret-as="date" format="mdy">12/25/2022</say-as>'}
            </pre>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>Advanced SSML Tags</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <code>&lt;audio src="url"&gt;</code>: Insert audio files.
            <pre className={styles.example}>
              {'<audio src="https://www.example.com/audio.mp3"/>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;mark name="start-point"&gt;</code>: Mark a point in the speech for synchronization.
            <pre className={styles.example}>
              {'<mark name="start-point"/>'}
            </pre>
          </li>
          <li className={styles.listItem}>
            <code>&lt;sub alias="AI"&gt;</code>: Substitute text with another.
            <pre className={styles.example}>
              {'<sub alias="Artificial Intelligence">AI</sub>'}
            </pre>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subtitle}>SSML Example</h2>
        <pre className={styles.example}>
          {`<speak>
  <voice name="en-US-Wavenet-D">
    <prosody rate="slow" pitch="-2st">
      Hello, how are you? <break time="500ms"/>
      I hope you're doing well today. 
      <emphasis level="strong">This is important!</emphasis> 
    </prosody>
  </voice>
  <audio src="https://www.example.com/sound.mp3"/>
</speak>`}
        </pre>
      </div>
    </div>
  );
};

export default SSMLPage;