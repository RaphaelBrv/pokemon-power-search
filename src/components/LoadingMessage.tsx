
import React from 'react';

const messages = [
  "Lancement des Poké Balls de détection...",
  "Connexion avec le réseau mondial des Centres Pokémon...",
  "Consultation des archives du Professeur Chen...",
  "Analyse des données Pokédex en cours..."
];

const LoadingMessage = () => {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-gray-600 italic">
      {messages[messageIndex]}
    </div>
  );
};

export default LoadingMessage;

