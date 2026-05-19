import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || 'mock_key',
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // In development/mock mode, we'll return a simulated response if no API key
    if (process.env.ASSEMBLYAI_API_KEY === 'mock_key' || !process.env.ASSEMBLYAI_API_KEY) {
      console.log('AssemblyAI: Mocking transcription for audio blob');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return "Show me the revenue trends for the last quarter in the North American region.";
    }

    const audioUrl = await uploadBlob(audioBlob);
    const transcript = await client.transcripts.transcribe({
      audio_url: audioUrl,
    });

    return transcript.text || '';
  } catch (error) {
    console.error('AssemblyAI Transcription Error:', error);
    throw error;
  }
}

async function uploadBlob(blob: Blob): Promise<string> {
  // Convert blob to Buffer/File for upload if needed, 
  // but AssemblyAI can also take a local path or URL.
  // For simplicity in this implementation, we assume the client handles the upload
  // when passed a file-like object, but here we just mock the URL for now
  // or use the client.transcripts.upload method.
  
  const file = new File([blob], 'recording.webm', { type: blob.type });
  const uploadUrl = await client.files.upload(file);
  return uploadUrl;
}
