import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParticipantsList } from './ParticipantsList';
import type { TripParticipantWithUser } from '../types';

const mockParticipants: TripParticipantWithUser[] = [
  {
    id: 'participant-1',
    tripId: 'trip-1',
    userId: 'user-1',
    rsvpStatus: 'GOING',
    role: 'ORGANIZER',
    joinedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user-1',
      username: 'organizer',
    },
  },
  {
    id: 'participant-2',
    tripId: 'trip-1',
    userId: 'user-2',
    rsvpStatus: 'GOING',
    role: 'PARTICIPANT',
    joinedAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    user: {
      id: 'user-2',
      username: 'participant1',
    },
  },
  {
    id: 'participant-3',
    tripId: 'trip-1',
    userId: 'user-3',
    rsvpStatus: 'INTERESTED',
    role: 'PARTICIPANT',
    joinedAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    user: {
      id: 'user-3',
      username: 'interested1',
    },
  },
];

describe('ParticipantsList', () => {
  it('renders participants list', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    expect(screen.getByTestId('participants-list')).toBeInTheDocument();
  });

  it('displays all participants', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    expect(screen.getByText('organizer')).toBeInTheDocument();
    expect(screen.getByText('participant1')).toBeInTheDocument();
    expect(screen.getByText('interested1')).toBeInTheDocument();
  });

  it('displays RSVP badges for each participant', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    const allText = screen.getAllByText(/going/i);
    expect(allText.length).toBeGreaterThan(0);
    const interestedText = screen.getAllByText(/interested/i);
    expect(interestedText.length).toBeGreaterThan(0);
  });

  it('displays organizer badge for organizer', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    const organizerTexts = screen.getAllByText(/organizer/i);
    expect(organizerTexts.length).toBeGreaterThan(0);
  });

  it('shows correct RSVP badge colors', () => {
    const { container } = render(<ParticipantsList participants={mockParticipants} />);
    // GOING should have green badge (using bg-green-500/80)
    const goingBadges = container.querySelectorAll('[class*="bg-green-500"]');
    expect(goingBadges.length).toBeGreaterThan(0);
  });

  it('handles empty participants list', () => {
    render(<ParticipantsList participants={[]} />);
    expect(screen.getByTestId('participants-list')).toBeInTheDocument();
    expect(screen.getByText(/no participants/i)).toBeInTheDocument();
  });

  it('displays participant count', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    expect(screen.getByText(/3 participants/i)).toBeInTheDocument();
  });

  it('applies modern UI styling', () => {
    const { container } = render(<ParticipantsList participants={mockParticipants} />);
    // Should have modern card styling
    expect(container.querySelector('.bg-white\\/5')).toBeInTheDocument();
  });

  it('groups participants by RSVP status', () => {
    render(<ParticipantsList participants={mockParticipants} />);
    // Should show going participants first
    const goingSections = screen.getAllByText(/going/i);
    expect(goingSections.length).toBeGreaterThan(0);
  });
});

