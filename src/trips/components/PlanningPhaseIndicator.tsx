import type { PlanningPhase } from '../types';

type PlanningPhaseIndicatorProps = {
  phase: PlanningPhase;
};

const phases: { value: PlanningPhase; label: string; description: string; color: string }[] = [
  {
    value: 'DATES',
    label: 'Choose Dates',
    description: 'Propose and vote on date ranges',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'DESTINATION',
    label: 'Choose Destination',
    description: 'Propose and vote on destinations',
    color: 'from-purple-500 to-pink-500',
  },
  {
    value: 'TRAVEL_CONFIRMATION',
    label: 'Confirm Travel',
    description: 'Mark when travel is booked',
    color: 'from-orange-500 to-red-500',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    description: 'All planning phases complete',
    color: 'from-green-500 to-emerald-500',
  },
];

export function PlanningPhaseIndicator({ phase }: PlanningPhaseIndicatorProps) {
  const currentPhaseIndex = phases.findIndex((p) => p.value === phase);
  const currentPhase = phases[currentPhaseIndex];

  return (
    <div data-testid="planning-phase-indicator" className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Planning Progress</h3>
        <div className="flex items-center gap-2">
          {phases.map((p, index) => {
            const isActive = p.value === phase;
            const isCompleted = index < currentPhaseIndex;
            const isUpcoming = index > currentPhaseIndex;

            return (
              <div key={p.value} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`
                      flex-1 h-2 rounded-full transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-r ${p.color}`
                          : isCompleted
                          ? 'bg-green-500'
                          : 'bg-white/10'
                      }
                    `}
                  />
                  {index < phases.length - 1 && (
                    <div
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${
                          isActive
                            ? `bg-gradient-to-r ${p.color}`
                            : isCompleted
                            ? 'bg-green-500'
                            : 'bg-white/10'
                        }
                      `}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-4 rounded-xl bg-gradient-to-r ${currentPhase.color} bg-opacity-20 border border-white/20`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">{currentPhase.label}</h4>
            <p className="text-sm text-gray-300 mt-1">{currentPhase.description}</p>
          </div>
          <div className="text-2xl">
            {phase === 'DATES' && '📅'}
            {phase === 'DESTINATION' && '🌍'}
            {phase === 'TRAVEL_CONFIRMATION' && '✈️'}
            {phase === 'COMPLETED' && '✅'}
          </div>
        </div>
      </div>
    </div>
  );
}

