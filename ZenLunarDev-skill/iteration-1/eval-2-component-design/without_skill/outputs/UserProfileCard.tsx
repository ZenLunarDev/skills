import React from 'react';
import './UserProfileCard.css';

export interface UserProfileCardProps {
  avatarUrl?: string;
  name: string;
  role: string;
  contactLabel?: string;
  onContact?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = React.memo(({
  avatarUrl,
  name,
  role,
  contactLabel = 'Contact',
  onContact,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleContactClick = React.useCallback(() => {
    if (onContact) {
      onContact();
    }
  }, [onContact]);

  return (
    <div className="upc-card" role="article" aria-label={`${name} profile`}>
      <div className="upc-inner">
        <div className="upc-avatar-wrapper">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              className="upc-avatar"
              loading="lazy"
            />
          ) : (
            <div className="upc-avatar upc-avatar-fallback" aria-hidden="true">
              {initials}
            </div>
          )}
          <div className="upc-avatar-glow" aria-hidden="true" />
        </div>

        <h3 className="upc-name">{name}</h3>
        <p className="upc-role">{role}</p>

        <button
          type="button"
          className="upc-contact-btn"
          onClick={handleContactClick}
          aria-label={`Contact ${name}`}
        >
          <span className="upc-btn-text">{contactLabel}</span>
          <span className="upc-btn-shimmer" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

UserProfileCard.displayName = 'UserProfileCard';

export default UserProfileCard;
