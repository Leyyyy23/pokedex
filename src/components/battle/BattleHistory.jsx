import React, { useEffect } from 'react';
import { useBattle } from '../../hooks/useBattle';
import { format } from 'date-fns';

const BattleHistory = () => {
  const { history, historyLoading, fetchBattleHistory } = useBattle();
  
  useEffect(() => {
    fetchBattleHistory();
  }, []);
  
  if (historyLoading && history.length === 0) {
    return <div className="loading">Loading battle history...</div>;
  }
  
  return (
    <div className="battle-history-container">
      <h2>Battle History</h2>
      
      {history.length === 0 ? (
        <div className="empty-history">
          <p>No battles recorded yet. Start a battle to see your history!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map(battle => (
            <div key={battle.id} className="history-item">
              <div className="battle-participants">
                <div className="participant">
                  <img src={battle.pokemon1.image} alt={battle.pokemon1.name} />
                  <span>{battle.pokemon1.name.charAt(0).toUpperCase() + battle.pokemon1.name.slice(1)}</span>
                </div>
                
                <div className="versus">VS</div>
                
                <div className="participant">
                  <img src={battle.pokemon2.image} alt={battle.pokemon2.name} />
                  <span>{battle.pokemon2.name.charAt(0).toUpperCase() + battle.pokemon2.name.slice(1)}</span>
                </div>
              </div>
              
              <div className="battle-outcome">
                <div className="winner">
                  <span>Winner: </span>
                  <strong>{battle.winnerName.charAt(0).toUpperCase() + battle.winnerName.slice(1)}</strong>
                  <span> (won {battle.roundsWon} rounds)</span>
                </div>
                
                <div className="battle-date">
                  {format(new Date(battle.date), 'PPpp')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BattleHistory;