import React, { memo, useCallback, useState } from 'react';
import styles from './UserProfileCard.module.css';

export interface UserProfileCardProps {
  /** Full name of the user */
  name: string;
  /** Role or job title */
  role: string;
  /** Avatar image URL */
  avatarUrl: string;
  /** Alternative text for the avatar image */
  avatarAlt?: string;
  /** Click handler for the contact button */
  onContact?: (name: string) => void;
  /** Online status indicator */
  isOnline?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  role,
  avatarUrl,
  avatarAlt,
  onContact,
  isOnline = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleContactClick = useCallback(() => {
    if (onContact) {
      onContact(name);
    }
  }, [onContact, name]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const fallbackInitial = name.charAt(0).toUpperCase();

  return (
    <article className={styles.card} aria-label={`User profile card for ${name}`}>
      <div className={styles.avatarWrapper}>
        {imageError || !avatarUrl ? (
          <div
            className={styles.avatar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.3), rgba(143, 142, 224, 0.3))',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '2rem',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            aria-hidden="true"
          >
            {fallbackInitial}
          </div>
        ) : (
          <img
            src={avatarUrl}
            alt={avatarAlt || `${name}'s avatar`}
            className={styles.avatar}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
        {isOnline && <span className={styles.statusIndicator} aria-label="Online" />}
      </div>

      <h2 className={styles.name}>{name}</h2>
      <p className={styles.role}>{role}</p>

      <button
        type="button"
        className={styles.contactButton}
        onClick={handleContactClick}
        aria-label={`Contact ${name}`}
      >
        <span>Contact</span>
        <span className={styles.buttonIcon} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </button>
    </article>
  );
};

export default memo(UserProfileCard);
