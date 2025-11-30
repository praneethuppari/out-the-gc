import type { TravelConfirmationWithUser } from "../types";

type TravelStatusListProps = {
  confirmations: TravelConfirmationWithUser[];
};

export function TravelStatusList({ confirmations }: TravelStatusListProps) {
  // TODO: Implement travel status list
  // - Show who has confirmed travel
  // - Show who hasn't confirmed yet
  if (confirmations.length === 0) {
    return <div className="text-gray-600">No travel confirmations yet</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {confirmations.map((confirmation) => (
        <div key={confirmation.id} className="card p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{confirmation.user.username}</span>
            <span className={confirmation.isBooked ? "text-green-600" : "text-gray-400"}>
              {confirmation.isBooked ? "✓ Booked" : "Not booked"}
            </span>
          </div>
          {confirmation.notes && (
            <p className="text-sm text-gray-600 mt-1">{confirmation.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

