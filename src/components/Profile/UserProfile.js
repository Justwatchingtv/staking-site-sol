const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="staking-stats">
        <h3>Your Staking Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <label>Total NFTs Staked</label>
            <span>{userStats.stakedCount}</span>
          </div>
          <div className="stat">
            <label>Total Rewards Earned</label>
            <span>{userStats.totalRewards}</span>
          </div>
          <div className="stat">
            <label>Current Rewards Rate</label>
            <span>{userStats.rewardsRate}/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 