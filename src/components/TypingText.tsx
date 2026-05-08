import React, { useState, useEffect } from 'react';

export const TypingText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const speed = 150; // Typing speed
  const deleteSpeed = 100; // Deleting speed
  const delay = 2000; // Wait time at the end

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < text.length) {
          setDisplayText(text.substring(0, displayText.length + 1));
          timer = setTimeout(handleTyping, speed);
        } else {
          timer = setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(text.substring(0, displayText.length - 1));
          timer = setTimeout(handleTyping, deleteSpeed);
        } else {
          setIsDeleting(false);
          timer = setTimeout(handleTyping, speed);
        }
      }
    };

    timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text]);

  return (
    <span>
      {displayText}
      <span className="inline-block w-[4px] h-[1em] bg-indigo-500 ml-1 align-middle animate-pulse" />
    </span>
  );
};