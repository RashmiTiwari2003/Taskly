import React from 'react';

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
    return initials;
  };

  const initials = getInitials(name);
  
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: 'green',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: `${size / 3}px`,
  } as React.CSSProperties;

  return (
    <div style={avatarStyle}>
      {initials}
    </div>
  );
};

export default Avatar;
