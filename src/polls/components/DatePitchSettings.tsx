import { useState, useEffect } from 'react';
import { useAction } from 'wasp/client/operations';
import { updateDatePitchSettings } from 'wasp/client/operations';
import { Button } from '../../shared/components/Button';
import type { TripWithParticipants } from '../../trips/types';

type DatePitchSettingsProps = {
  trip: TripWithParticipants;
  currentUserId: string;
};

export function DatePitchSettings({ trip, currentUserId }: DatePitchSettingsProps) {
  const isOrganizer = trip.organizerId === currentUserId;
  const [datePitchDeadline, setDatePitchDeadline] = useState<string>('');
  const [deadlineTime, setDeadlineTime] = useState<string>('23:59');
  const [votingDurationDays, setVotingDurationDays] = useState<number>(trip.votingDeadlineDurationDays || 7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ submit?: string }>({});

  const updateSettingsAction = useAction(updateDatePitchSettings);

  // Initialize form with existing deadline if set
  useEffect(() => {
    if (trip.datePitchDeadline) {
      const deadline = new Date(trip.datePitchDeadline);
      // Use local date/time, not UTC
      const year = deadline.getFullYear();
      const month = String(deadline.getMonth() + 1).padStart(2, '0');
      const day = String(deadline.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const hours = String(deadline.getHours()).padStart(2, '0');
      const minutes = String(deadline.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      setDatePitchDeadline(dateStr);
      setDeadlineTime(timeStr);
    }
  }, [trip.datePitchDeadline]);

  if (!isOrganizer) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate that the combined date/time is in the future (using local time)
    const now = new Date();
    // Create date in local timezone (not UTC)
    const [year, month, day] = datePitchDeadline.split('-').map(Number);
    const [hours, minutes] = deadlineTime.split(':').map(Number);
    const deadlineDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    if (deadlineDateTime <= now) {
      setErrors({ submit: 'Deadline must be in the future. Please select a date and time that is after the current time.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSettingsAction({
        tripId: trip.id,
        datePitchDeadline: deadlineDateTime,
        votingDeadlineDurationDays: votingDurationDays,
      });
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      setErrors({ submit: error?.message || 'Failed to update settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  // Get today's date in local timezone for the min date
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const deadline = trip.datePitchDeadline ? new Date(trip.datePitchDeadline) : null;
  const isDeadlinePassed = deadline && now >= deadline;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Date Proposal Settings</h3>
      
      {deadline && (
        <div className="mb-4 p-3 rounded-lg border border-white/10 bg-white/5">
          <p className="text-sm text-gray-300">
            <span className="font-medium">Current deadline:</span>{' '}
            {deadline.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
          {isDeadlinePassed && (
            <p className="text-sm text-yellow-400 mt-1">
              ⚠️ Deadline has passed. Please set a new deadline to allow more proposals.
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="datePitchDeadline" className="block text-sm font-medium text-gray-300 mb-1">
            Proposal Deadline Date
          </label>
          <input
            id="datePitchDeadline"
            type="date"
            value={datePitchDeadline}
            onChange={(e) => setDatePitchDeadline(e.target.value)}
            min={minDate}
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            You can select today's date if the time is in the future.
          </p>
        </div>

        <div>
          <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-300 mb-1">
            Deadline Time (your local time)
          </label>
          <input
            id="deadlineTime"
            type="time"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
          {datePitchDeadline && (
            <p className="text-xs text-gray-400 mt-1">
              {(() => {
                const [year, month, day] = datePitchDeadline.split('-').map(Number);
                const [hours, minutes] = deadlineTime.split(':').map(Number);
                const selectedDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
                const now = new Date();
                if (selectedDateTime <= now) {
                  return <span className="text-yellow-400">⚠️ Selected time must be in the future</span>;
                }
                return `Deadline: ${selectedDateTime.toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}`;
              })()}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="votingDurationDays" className="block text-sm font-medium text-gray-300 mb-1">
            Voting Duration (days after deadline)
          </label>
          <input
            id="votingDurationDays"
            type="number"
            min="1"
            max="30"
            value={votingDurationDays}
            onChange={(e) => setVotingDurationDays(parseInt(e.target.value) || 7)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            How many days after the proposal deadline should voting remain open?
          </p>
        </div>

        {errors.submit && (
          <div className="text-sm text-red-400">{errors.submit}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !datePitchDeadline}
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}

