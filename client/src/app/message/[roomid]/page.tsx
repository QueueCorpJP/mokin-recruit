import React from 'react';

interface MessagePageProps {
  params: Promise<{
    roomid: string;
  }>;
}

export default async function MessagePage({ params }: MessagePageProps) {
  const { roomid } = await params;
  
  return (
    <div>
      <h1>Message Room: {roomid}</h1>
      <p>This page is under development.</p>
    </div>
  );
}