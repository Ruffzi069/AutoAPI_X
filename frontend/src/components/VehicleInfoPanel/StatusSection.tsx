/**
 * Status Section Component
 */

interface StatusSectionProps {
  title: string;
  children: React.ReactNode;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ title, children }) => {
  return (
    <div className="status-section mb-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-primary-purple/20">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};
