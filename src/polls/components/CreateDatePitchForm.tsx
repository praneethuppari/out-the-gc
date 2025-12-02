import { useState, useMemo } from 'react';
import { useAction } from 'wasp/client/operations';
import { createDatePitch } from 'wasp/client/operations';
import { Button } from '../../shared/components/Button';

type CreateDatePitchFormProps = {
  tripId: string;
};

type FormData = {
  startDate: string;
  endDate: string;
};

export function CreateDatePitchForm({ tripId }: CreateDatePitchFormProps) {
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>> & { submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDatePitchAction = useAction(createDatePitch);

  // Calculate nights and days
  const { nights, days } = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return { nights: 0, days: 0 };
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return { nights: 0, days: 0 };
    }

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    const days = diffDays;

    return { nights, days };
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Deadlines are set by organizer in trip settings
      await createDatePitchAction({
        tripId,
        startDate,
        endDate,
      });

      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to create date pitch:', error);
      setErrors({ submit: 'Failed to create date pitch. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="create-date-pitch-form" className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Propose Date Range</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
            {errors.startDate && (
              <span className="text-sm text-red-400 mt-1">{errors.startDate}</span>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || undefined}
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
            {errors.endDate && (
              <span className="text-sm text-red-400 mt-1">{errors.endDate}</span>
            )}
          </div>
        </div>

        {formData.startDate && formData.endDate && nights > 0 && (
          <div className="bg-primary-500/20 border border-primary-500/30 rounded-lg p-3">
            <p className="text-sm text-white">
              <span className="font-semibold">{nights}</span> night{nights !== 1 ? 's' : ''} /{' '}
              <span className="font-semibold">{days}</span> day{days !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="text-sm text-red-400">{errors.submit}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Proposing...' : 'Propose Dates'}
        </Button>
      </form>
    </div>
  );
}

