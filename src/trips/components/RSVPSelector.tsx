import { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { updateRSVP } from 'wasp/client/operations';
import type { RSVPStatus } from '../types';

type RSVPSelectorProps = {
  tripId: string;
  currentStatus: RSVPStatus | null;
  onRSVPChange?: (newStatus: RSVPStatus) => Promise<void>;
};

export function RSVPSelector({ tripId, currentStatus, onRSVPChange }: RSVPSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateRSVPMutation = useAction(updateRSVP);

  const handleRSVPChange = async (newStatus: RSVPStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    setIsUpdating(true);
    try {
      if (onRSVPChange) {
        // Use custom handler (for join flow)
        await onRSVPChange(newStatus);
        // Reset updating state after custom handler completes
        setIsUpdating(false);
      } else {
        // Use default handler (for dashboard)
        await updateRSVPMutation({
          tripId,
          rsvpStatus: newStatus,
        });
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Failed to update RSVP:', error);
      setIsUpdating(false);
    }
  };

  const getPermissionMessage = (status: RSVPStatus | null) => {
    if (status === 'GOING') {
      return 'You can vote and propose ideas';
    }
    return 'View-only';
  };

  const rsvpOptions: { value: RSVPStatus; label: string; color: string }[] = [
    { value: 'GOING', label: 'Going', color: 'bg-green-500' },
    { value: 'INTERESTED', label: 'Interested', color: 'bg-yellow-500' },
    { value: 'NOT_GOING', label: 'Not Going', color: 'bg-red-500' },
  ];

  return (
    <div
      data-testid="rsvp-selector"
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Your Status</h3>
        <p className="text-sm text-gray-300">{getPermissionMessage(currentStatus)}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {rsvpOptions.map((option) => {
          const isActive = currentStatus === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleRSVPChange(option.value)}
              disabled={isUpdating}
              className={`
                px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${
                  isActive
                    ? `${option.color} text-white shadow-lg scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }
                ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {isUpdating && (
        <p className="mt-3 text-sm text-gray-400">Updating...</p>
      )}
    </div>
  );
}

