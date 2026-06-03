/**
 * Control Card Component
 * Tesla-style control card
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ControlCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  active?: boolean;
  fullWidth?: boolean;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  icon,
  label,
  sublabel,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  active = false,
  fullWidth = false
}) => {
  const getCardStyle = () => {
    if (active) {
      return 'control-card active';
    }
    if (variant === 'secondary') {
      return 'control-card secondary';
    }
    return 'control-card primary';
  };
  
  return (
    <motion.button
      className={`${getCardStyle()} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="card-icon">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          icon
        )}
      </div>
      <div className="card-content">
        <span className="card-label">{label}</span>
        {sublabel && <span className="card-sublabel">{sublabel}</span>}
      </div>
    </motion.button>
  );
};
