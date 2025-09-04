export {};

import React from 'react';

type Achievement = {
  id: number;
  title: string;
  description: string;
};

type AchievementsBadgeProps = {
  achievements: Achievement[];
};

const AchievementsBadge: React.FC<AchievementsBadgeProps> = ({ achievements }) => {
  return (
    <div className="achievements-badge">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="badge">
          <h3 className="badge-title">{achievement.title}</h3>
          <p className="badge-description">{achievement.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AchievementsBadge;