// src/helpers/whisperApi.jsx
import axios from 'axios';

export const convertSpeechToText = async (audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
        const response = await axios.post('http://localhost:5000/transcribe_audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Check if the response contains the transcribed text
        if (response.data && response.data.text) {
            console.log("Transcription:", response.data.text);
            return response.data.text;
        } else {
            // Handle the case where transcribed text is not in the response
            console.error('Transcribed text not found in the response');
            throw new Error('Transcribed text not found in the response');
        }
    } catch (error) {
        console.error('Error in transcription:', error);
        throw error;
    }
};