import React from 'react';

const JoinPage = () => (
  <div style={styles.page}>
    <h1>Join the Club</h1>
    <p>Choose your membership: Social Runner (Free), Club Member (€20/month), Race Team (€35/month).</p>
    <ul>
      <li>Weekly coached runs and pace groups</li>
      <li>Priority event registration and member discounts in shop</li>
      <li>Community chat and race-day support</li>
    </ul>
  </div>
);

const styles = { page: { minHeight: '100vh', background: '#121212', color: '#fff', padding: '100px 24px' } };
export default JoinPage;
