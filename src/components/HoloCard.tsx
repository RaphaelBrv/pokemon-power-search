
import React, { useRef, useState, useEffect } from 'react';
import './HoloCard.css';

interface HoloCardProps {
  image: string;
  name: string;
}

const HoloCard: React.FC<HoloCardProps> = ({ image, name }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    setIsAnimated(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const card = cardRef.current;
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const h = rect.height;
    const w = rect.width;
    
    const px = Math.abs(Math.floor(100 / w * x) - 100);
    const py = Math.abs(Math.floor(100 / h * y) - 100);
    const pa = (50 - px) + (50 - py);
    
    const lp = (50 + (px - 50) / 1.5);
    const tp = (50 + (py - 50) / 1.5);
    const px_spark = (50 + (px - 50) / 7);
    const py_spark = (50 + (py - 50) / 7);
    const p_opc = 20 + (Math.abs(pa) * 1.5);
    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * .5;

    // Debug pour vérifier si les événements passent
    // console.log("Holo Move", { tx, ty });

    card.style.setProperty('--grad-pos', `${lp}% ${tp}%`);
    card.style.setProperty('--sprk-pos', `${px_spark}% ${py_spark}%`);
    card.style.setProperty('--opc', `${p_opc / 100}`);
    card.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg)`;
  };

  const handleMouseOut = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    
    card.style.transform = '';
    card.style.removeProperty('--grad-pos');
    card.style.removeProperty('--sprk-pos');
    card.style.removeProperty('--opc');
    
    timeoutRef.current = setTimeout(() => {
      setIsAnimated(true);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="holo-card-container">
      <div 
        ref={cardRef}
        className={`holo-card ${isAnimated ? 'animated' : ''}`}
        style={{ 
          backgroundImage: `url("${image}")`,
          '--card-image': `url("${image}")` 
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseOut}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseOut}
      >
        <img src={image} alt={name} className="opacity-0 w-full h-full pointer-events-none" />
      </div>
    </div>
  );
};

export default HoloCard;
