import { useQuery, useAction } from 'wasp/client/operations';
import { getDatePitches, getDestinationPitches, voteOnDatePitch } from 'wasp/client/operations';
import { CreateDatePitchForm } from '../../polls/components/CreateDatePitchForm';
import { CreateDestinationPitchForm } from '../../polls/components/CreateDestinationPitchForm';
import { DatePitchCard } from '../../polls/components/DatePitchCard';
import { DateVoteForm } from '../../polls/components/DateVoteForm';
import { DatePitchSettings } from '../../polls/components/DatePitchSettings';
import { DestinationPitchCard } from '../../polls/components/DestinationPitchCard';
import { TravelStatusList } from '../../travel/components/TravelStatusList';
import { getTravelConfirmations } from 'wasp/client/operations';
import type { TripWithParticipants } from '../types';
import type { DatePitchWithVotes } from '../../polls/types';
import type { DateVoteType } from '../../polls/types';

type PlanningPhaseContentProps = {
  trip: TripWithParticipants;
  currentUserId: string;
};

export function PlanningPhaseContent({ trip, currentUserId }: PlanningPhaseContentProps) {
  const currentParticipant = trip.participants.find((p) => p.userId === currentUserId);
  const canVote = currentParticipant?.rsvpStatus === 'GOING';

  if (trip.phase === 'DATES') {
    return <DatesPhaseContent trip={trip} canVote={canVote || false} currentUserId={currentUserId} />;
  }

  if (trip.phase === 'DESTINATION') {
    return <DestinationPhaseContent tripId={trip.id} canVote={canVote || false} />;
  }

  if (trip.phase === 'TRAVEL_CONFIRMATION') {
    return <TravelConfirmationPhaseContent tripId={trip.id} canVote={canVote || false} />;
  }

  return null;
}

function DatesPhaseContent({ trip, canVote, currentUserId }: { trip: TripWithParticipants; canVote: boolean; currentUserId: string }) {
  const { data: datePitches, isLoading, refetch } = useQuery(getDatePitches, { tripId: trip.id }) as {
    data: DatePitchWithVotes[] | undefined;
    isLoading: boolean;
    refetch: () => Promise<any>;
  };
  const voteAction = useAction(voteOnDatePitch);

  // Check voting phase using trip's deadline
  const now = new Date();
  const tripPitchDeadline = trip.datePitchDeadline ? new Date(trip.datePitchDeadline) : null;
  const votingDeadline = tripPitchDeadline && trip.votingDeadlineDurationDays
    ? (() => {
        const deadline = new Date(tripPitchDeadline);
        deadline.setDate(deadline.getDate() + trip.votingDeadlineDurationDays);
        return deadline;
      })()
    : null;

  const isProposalPhase = tripPitchDeadline ? now < tripPitchDeadline : true;
  const isVotingPhase = tripPitchDeadline && votingDeadline
    ? now >= tripPitchDeadline && now < votingDeadline
    : false;
  const isVotingClosed = votingDeadline ? now >= votingDeadline : false;

  const handleVote = async (pitchId: string, voteType: DateVoteType, selectedDates?: string[]) => {
    try {
      await voteAction({
        pitchId,
        voteType,
        selectedDates,
      });
      await refetch();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const isOrganizer = trip.organizerId === currentUserId;

  return (
    <div data-testid="dates-phase-content" className="space-y-6">
      {/* Organizer Settings */}
      {isOrganizer && (
        <DatePitchSettings trip={trip} currentUserId={currentUserId} />
      )}

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">Choose Dates</h3>
        <p className="text-gray-300 mb-6">
          Propose date ranges for the trip. Once the deadline passes, everyone will vote on the options.
        </p>

        {!tripPitchDeadline && isOrganizer && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Please set a proposal deadline above before participants can propose dates.
            </p>
          </div>
        )}

        {tripPitchDeadline && isProposalPhase && canVote && (
          <div className="mb-6">
            <CreateDatePitchForm tripId={trip.id} />
          </div>
        )}

        {tripPitchDeadline && !isProposalPhase && !isVotingPhase && !isVotingClosed && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              Proposal deadline has passed. Voting will begin shortly.
            </p>
          </div>
        )}

        {!canVote && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              Only "Going" participants can propose dates. Change your RSVP status to participate.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Proposed Dates</h4>
          {isLoading ? (
            <p className="text-gray-400">Loading dates...</p>
          ) : datePitches && datePitches.length > 0 ? (
            datePitches.map((pitch) => {
              return (
                <div key={pitch.id} className="space-y-4">
                  <DatePitchCard pitch={pitch} tripPitchDeadline={tripPitchDeadline} tripVotingDeadline={votingDeadline} />
                  {isVotingPhase && canVote && (
                    <div className="ml-4">
                      <DateVoteForm
                        pitch={pitch}
                        onVote={(voteType, selectedDates) => handleVote(pitch.id, voteType, selectedDates)}
                        userId={currentUserId}
                        tripPitchDeadline={tripPitchDeadline}
                        tripVotingDeadline={votingDeadline}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center py-8">No date proposals yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DestinationPhaseContent({ tripId, canVote }: { tripId: string; canVote: boolean }) {
  const { data: destinationPitches, isLoading } = useQuery(getDestinationPitches, { tripId }) as {
    data: any[] | undefined;
    isLoading: boolean;
  };

  return (
    <div data-testid="destination-phase-content" className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">Choose Destination</h3>
        <p className="text-gray-300 mb-6">
          Propose destinations for the trip. Everyone will vote using ranked-choice voting.
        </p>

        {canVote && (
          <div className="mb-6">
            <CreateDestinationPitchForm tripId={tripId} />
          </div>
        )}

        {!canVote && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              Only "Going" participants can propose destinations. Change your RSVP status to participate.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Proposed Destinations</h4>
          {isLoading ? (
            <p className="text-gray-400">Loading destinations...</p>
          ) : destinationPitches && destinationPitches.length > 0 ? (
            destinationPitches.map((pitch) => <DestinationPitchCard key={pitch.id} pitch={pitch} />)
          ) : (
            <p className="text-gray-400 text-center py-8">No destination proposals yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TravelConfirmationPhaseContent({ tripId, canVote }: { tripId: string; canVote: boolean }) {
  const { data: travelConfirmations, isLoading } = useQuery(getTravelConfirmations, { tripId }) as {
    data: any[] | undefined;
    isLoading: boolean;
  };

  return (
    <div data-testid="travel-confirmation-phase-content" className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">Confirm Travel</h3>
        <p className="text-gray-300 mb-6">
          Mark when you've booked your travel. Once everyone has confirmed, the trip planning is complete!
        </p>

        {isLoading ? (
          <p className="text-gray-400">Loading travel confirmations...</p>
        ) : (
          <TravelStatusList confirmations={travelConfirmations || []} />
        )}
      </div>
    </div>
  );
}

