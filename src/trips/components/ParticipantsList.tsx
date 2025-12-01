import type { TripParticipantWithUser, RSVPStatus } from '../types';

type ParticipantsListProps = {
  participants: TripParticipantWithUser[];
};

export function ParticipantsList({ participants }: ParticipantsListProps) {
  const rsvpBadgeColors = {
    GOING: 'bg-green-500/80 text-white',
    INTERESTED: 'bg-yellow-500/80 text-white',
    NOT_GOING: 'bg-red-500/80 text-white',
  };

  const groupedParticipants = {
    GOING: participants.filter((p) => p.rsvpStatus === 'GOING'),
    INTERESTED: participants.filter((p) => p.rsvpStatus === 'INTERESTED'),
    NOT_GOING: participants.filter((p) => p.rsvpStatus === 'NOT_GOING'),
  };

  return (
    <div
      data-testid="participants-list"
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Participants</h3>
        <span className="text-sm text-gray-400">{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
      </div>

      {participants.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No participants</p>
      ) : (
        <div className="space-y-4">
          {(['GOING', 'INTERESTED', 'NOT_GOING'] as const).map((status) => {
            const group = groupedParticipants[status];
            if (group.length === 0) return null;

            return (
              <div key={status} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {status === 'GOING' ? 'Going' : status === 'INTERESTED' ? 'Interested' : 'Not Going'}
                </h4>
                <div className="space-y-2">
                  {group.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {participant.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{participant.user.username}</p>
                          {participant.role === 'ORGANIZER' && (
                            <span className="text-xs text-cyan-400">Organizer</span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvpBadgeColors[participant.rsvpStatus as RSVPStatus]
                        }`}
                      >
                        {participant.rsvpStatus === 'GOING'
                          ? 'Going'
                          : participant.rsvpStatus === 'INTERESTED'
                          ? 'Interested'
                          : 'Not Going'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

