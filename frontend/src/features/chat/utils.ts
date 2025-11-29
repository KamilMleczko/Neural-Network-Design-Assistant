/**
 * Simulates streaming of text content.
 * @param content The full content to stream.
 * @param onChunk Callback function called with the updated content so far.
 * @param onComplete Callback function called when streaming is complete.
 * @param chunkSize Number of characters to append per interval.
 * @param delay Interval delay in milliseconds.
 * @returns A cleanup function to clear the interval.
 */
export const simulateStreaming = (
  content: string,
  onChunk: (currentContent: string) => void,
  onComplete: () => void,
  chunkSize: number = 5,
  delay: number = 10,
) => {
  let currentContent = "";
  let i = 0;

  const intervalId = setInterval(() => {
    if (i < content.length) {
      currentContent += content.slice(i, i + chunkSize);
      onChunk(currentContent);
      i += chunkSize;
    } else {
      clearInterval(intervalId);
      onComplete();
    }
  }, delay);

  return () => clearInterval(intervalId);
};
