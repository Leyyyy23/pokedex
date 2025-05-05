import { v4 as uuidv4 } from 'uuid';

export const getPlayerId = () => {
  let playerId = sessionStorage.getItem('playerId');
  
  if (!playerId) {
    playerId = uuidv4();
    sessionStorage.setItem('playerId', playerId);
  }
  
  return playerId;
};