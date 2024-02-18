let mediaRecorder;
let audioChunks = [];

export const startRecording = async () => {
    if (!navigator.mediaDevices) {
        throw new Error("Media devices not supported in this browser.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
};

export const stopRecording = () => {
    return new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            resolve(audioBlob);
        });

        mediaRecorder.stop();
    });
};
