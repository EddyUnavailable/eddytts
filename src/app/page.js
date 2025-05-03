import Image from "next/image";
import styles from "./page.module.css";
import React from 'react';
import Link from 'next/link';
import TextToSpeech from './components/TextToSpeech';
require('dotenv').config();

export default function HomePage() {
  return (
    <div>
      <div>
        <p>Just some info here</p>
        <TextToSpeech />
      </div>
    </div>
  );
}