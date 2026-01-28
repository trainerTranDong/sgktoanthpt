import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax?: any;
  }
}

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise && containerRef.current) {
      // Create a temporary element to hold content
      containerRef.current.innerHTML = content;
      window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => console.log('MathJax error:', err));
    } else if (containerRef.current) {
        // Fallback if MathJax isn't loaded yet (basic render)
        containerRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`math-content overflow-x-auto max-w-full ${className}`} 
      style={{ lineHeight: '1.8' }} // Improve readability for math
    />
  );
};

export default MathRenderer;