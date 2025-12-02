import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => ({
  useAuth: vi.fn(() => ({ data: null })),
  SignupForm: ({ additionalFields }: { additionalFields?: Array<{ name: string; label: string; type: string; validations?: unknown }> }) => {
    const fieldElements = additionalFields?.map((field) =>
      React.createElement('div', { key: field.name },
        React.createElement('label', { htmlFor: field.name }, field.label),
        React.createElement('input', {
          id: field.name,
          name: field.name,
          type: field.type === "password" ? "password" : field.type === "input" ? "text" : field.type,
          'data-testid': `${field.name}-input`,
          required: true
        })
      )
    );
    
    return React.createElement('form', { 'data-testid': 'signup-form', onSubmit: (e: React.FormEvent) => e.preventDefault() },
      React.createElement('label', { htmlFor: 'email' }, 'Email'),
      React.createElement('input', { id: 'email', name: 'email', type: 'email', 'data-testid': 'email-input', required: true }),
      React.createElement('label', { htmlFor: 'password' }, 'Password'),
      React.createElement('input', { id: 'password', name: 'password', type: 'password', 'data-testid': 'password-input', required: true }),
      ...(fieldElements || []),
      React.createElement('button', { type: 'submit', 'data-testid': 'submit-button' }, 'Sign Up')
    );
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, className, ...props }: { to: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href: to, className, 'data-testid': `link-${to}`, ...props }, children),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useParams: () => ({}),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
}));

// Mock wasp client/router
vi.mock('wasp/client/router', () => ({
  Link: ({ to, children, className, ...props }: { to: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href: to, className, ...props }, children),
}));

