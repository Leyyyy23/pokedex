import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Pokédex App. All rights reserved.</p>
      <p>Pokémon and Pokémon character names are trademarks of Nintendo.</p>
    </footer>
  );
};

export default Footer;