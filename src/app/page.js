"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import TextToSpeech from './components/TextToSpeech';
import VoiceListPreview from './components/VoiceListPreview';

export default function HomePage() {
  const [voices, setVoices] = useState([]); // Initialize voices state
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/tts'; // Use environment variable

  // Fetch voices from the API
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/voices`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch voices');

        const data = await response.json();
        setVoices(data.voices || []); // Set the fetched voices
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  return (
    <div>
      <div>
        <p>Just some info here</p>
        <TextToSpeech />
        <div>
          <h1>Voice Preview Tool</h1>
          <VoiceListPreview voices={voices} apiEndpoint={apiEndpoint} />
        </div>
      </div>
    </div>
  );
}