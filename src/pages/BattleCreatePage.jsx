import React from 'react';
import BattleInvitation from '../components/battle/BattleInvitation';
import { BattleSessionProvider } from '../contexts/BattleSessionContext';

const BattleCreatePage = () => {
  return (
    <BattleSessionProvider>
      <div className="battle-create-page">
        <h1>Create a Battle</h1>
        <BattleInvitation />
      </div>
    </BattleSessionProvider>
  );
};

export default BattleCreatePage;