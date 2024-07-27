import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';

const StyledLoopingTypingEffect = ({ texts, typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const currentText = texts[currentTextIndex];

    if (isTyping) {
      if (currentIndex < currentText.length) {
        const typingTimer = setTimeout(() => {
          setDisplayText((prevText) => prevText + currentText[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(typingTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (currentIndex > 0) {
        const deletingTimer = setTimeout(() => {
          setDisplayText((prevText) => prevText.slice(0, -1));
          setCurrentIndex((prevIndex) => prevIndex - 1);
        }, deletingSpeed);
        return () => clearTimeout(deletingTimer);
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [currentIndex, currentTextIndex, isTyping, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration]);

  const handleCopy = () => {
    navigator.clipboard.writeText(texts[currentTextIndex]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  };

  const headingStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  };
  const headerStyle = {
    fontSize: '25px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  };

  const textContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
  };

  const textStyle = {
    fontSize: '18px',
    color: '#4b5563',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  };

  const copyButtonStyle = {
    position: 'absolute',
    right: '8px',
    top: '8px',
    padding: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const copiedMessageStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#10b981',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Basic app to get the schema of the SQL database and based on that fetches the data from the natural language</h2>
      <h3 style={headingStyle}>Demo Text to Search</h3>
      <div style={textContainerStyle}>
        <div style={textStyle}>{displayText}</div>
        <button
          onClick={handleCopy}
          style={copyButtonStyle}
          aria-label="Copy text"
        >
          <Copy size={16} />
        </button>
      </div>
      {copied && (
        <div style={copiedMessageStyle}>Copied to clipboard!</div>
      )}
    </div>
  );
};

export default () => (
  <StyledLoopingTypingEffect 
    texts={[
      "Get me companies that are attending Trading related events",
      "I need the email addresses and names of people working for companies that are attending events in Marina Bay Sands"
    ]}
  />
);
