import type { DatePitchWithVotes } from '../types';

type VoteResultsProps = {
  pitch: DatePitchWithVotes;
};

type DateAvailability = {
  date: string;
  availableUsers: string[];
  unavailableUsers: string[];
};

type BestDateRange = {
  startDate: string;
  endDate: string;
  totalAvailableUsers: number;
  dates: DateAvailability[];
};

function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current).toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function calculateBestDateRange(pitch: DatePitchWithVotes): BestDateRange | null {
  if (pitch.votes.length === 0) {
    return null;
  }

  const startDate = new Date(pitch.startDate);
  const endDate = new Date(pitch.endDate);
  const allDates = generateDateRange(startDate, endDate);

  // Build availability map for each date
  const dateAvailability: Map<string, DateAvailability> = new Map();
  
  allDates.forEach((date) => {
    dateAvailability.set(date, {
      date,
      availableUsers: [],
      unavailableUsers: [],
    });
  });

  // Process each vote
  pitch.votes.forEach((vote) => {
    const username = vote.user.username;
    
    if (vote.voteType === 'ALL_WORK') {
      // User is available for all dates
      allDates.forEach((date) => {
        const availability = dateAvailability.get(date)!;
        availability.availableUsers.push(username);
      });
    } else if (vote.voteType === 'NONE_WORK') {
      // User is unavailable for all dates
      allDates.forEach((date) => {
        const availability = dateAvailability.get(date)!;
        availability.unavailableUsers.push(username);
      });
    } else if (vote.voteType === 'PARTIAL' && vote.selectedDates) {
      // User is available for specific dates only
      try {
        const selectedDates = JSON.parse(vote.selectedDates) as string[];
        allDates.forEach((date) => {
          const availability = dateAvailability.get(date)!;
          if (selectedDates.includes(date)) {
            availability.availableUsers.push(username);
          } else {
            // User is not available for this date
            availability.unavailableUsers.push(username);
          }
        });
      } catch (e) {
        // Invalid JSON, treat as unavailable
        allDates.forEach((date) => {
          const availability = dateAvailability.get(date)!;
          availability.unavailableUsers.push(username);
        });
      }
    }
  });

  // Find the best contiguous date range
  // Prioritize dates where most people are available for ALL dates in the range
  let bestRange: BestDateRange | null = null;
  let maxScore = 0;

  // Try all possible contiguous ranges
  for (let i = 0; i < allDates.length; i++) {
    for (let j = i; j < allDates.length; j++) {
      const rangeDates = allDates.slice(i, j + 1);
      
      // Calculate score: number of users available for ALL dates in this range
      const usersAvailableForAllDates = new Set<string>();
      const allUsers = new Set<string>();
      
      pitch.votes.forEach((vote) => {
        allUsers.add(vote.user.username);
      });

      allUsers.forEach((username) => {
        const isAvailableForAll = rangeDates.every((date) => {
          const availability = dateAvailability.get(date)!;
          return availability.availableUsers.includes(username);
        });
        
        if (isAvailableForAll) {
          usersAvailableForAllDates.add(username);
        }
      });

      // Score: prioritize ranges with more users available for all dates
      // Also consider range length (longer ranges are better if same availability)
      const score = usersAvailableForAllDates.size * 1000 + rangeDates.length;

      if (score > maxScore) {
        maxScore = score;
        bestRange = {
          startDate: rangeDates[0],
          endDate: rangeDates[rangeDates.length - 1],
          totalAvailableUsers: usersAvailableForAllDates.size,
          dates: rangeDates.map((date) => dateAvailability.get(date)!),
        };
      }
    }
  }

  return bestRange;
}

export function VoteResults({ pitch }: VoteResultsProps) {
  const bestRange = calculateBestDateRange(pitch);

  if (!bestRange) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="text-sm text-gray-400">No votes yet</p>
      </div>
    );
  }

  const allUsers = new Set<string>();
  pitch.votes.forEach((vote) => {
    allUsers.add(vote.user.username);
  });

  // Get users who are available for all dates in the best range
  const usersAvailableForAll = new Set<string>();
  allUsers.forEach((username) => {
    const isAvailableForAll = bestRange.dates.every((date) => {
      return date.availableUsers.includes(username);
    });
    if (isAvailableForAll) {
      usersAvailableForAll.add(username);
    }
  });

  // Get users who are partially available
  const usersPartiallyAvailable = new Set<string>();
  allUsers.forEach((username) => {
    if (!usersAvailableForAll.has(username)) {
      const hasAnyAvailability = bestRange.dates.some((date) => {
        return date.availableUsers.includes(username);
      });
      if (hasAnyAvailability) {
        usersPartiallyAvailable.add(username);
      }
    }
  });

  // Get users who are unavailable for all dates in the range
  const usersUnavailable = new Set<string>();
  allUsers.forEach((username) => {
    if (!usersAvailableForAll.has(username) && !usersPartiallyAvailable.has(username)) {
      usersUnavailable.add(username);
    }
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h4 className="font-semibold text-white text-lg mb-4">Vote Results</h4>
      
      {/* Best Date Range */}
      <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-medium text-white">Best Date Range:</span>
        </p>
        <p className="text-lg font-semibold text-white">
          {formatDate(bestRange.startDate)} - {formatDate(bestRange.endDate)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {bestRange.totalAvailableUsers} of {allUsers.size} {allUsers.size === 1 ? 'person is' : 'people are'} available for all dates
        </p>
      </div>

      {/* Availability Summary */}
      <div className="space-y-4">
        {usersAvailableForAll.size > 0 && (
          <div>
            <p className="text-sm font-medium text-green-400 mb-2">
              ✓ Available for all dates ({usersAvailableForAll.size}):
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(usersAvailableForAll).map((username) => (
                <span
                  key={username}
                  className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded border border-green-500/30"
                >
                  {username}
                </span>
              ))}
            </div>
          </div>
        )}

        {usersPartiallyAvailable.size > 0 && (
          <div>
            <p className="text-sm font-medium text-yellow-400 mb-2">
              ⚠ Partially available ({usersPartiallyAvailable.size}):
            </p>
            <div className="space-y-2">
              {Array.from(usersPartiallyAvailable).map((username) => {
                const availableDates = bestRange.dates
                  .filter((d) => d.availableUsers.includes(username))
                  .map((d) => formatDate(d.date));
                
                return (
                  <div key={username} className="pl-2">
                    <span className="text-xs text-yellow-300 font-medium">{username}:</span>
                    <span className="text-xs text-gray-400 ml-2">
                      Available on {availableDates.join(', ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {usersUnavailable.size > 0 && (
          <div>
            <p className="text-sm font-medium text-red-400 mb-2">
              ✗ Unavailable ({usersUnavailable.size}):
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(usersUnavailable).map((username) => (
                <span
                  key={username}
                  className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded border border-red-500/30"
                >
                  {username}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Date Breakdown */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm font-medium text-white mb-3">Date-by-Date Availability:</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {bestRange.dates.map((dateAvailability) => (
            <div
              key={dateAvailability.date}
              className="p-2 bg-white/5 rounded border border-white/10"
            >
              <p className="text-xs font-medium text-white mb-1">
                {formatDate(dateAvailability.date)}
              </p>
              <div className="flex flex-wrap gap-1">
                {dateAvailability.availableUsers.length > 0 && (
                  <span className="text-xs text-green-400">
                    {dateAvailability.availableUsers.length} available
                  </span>
                )}
                {dateAvailability.unavailableUsers.length > 0 && (
                  <span className="text-xs text-red-400">
                    {dateAvailability.unavailableUsers.length} unavailable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

