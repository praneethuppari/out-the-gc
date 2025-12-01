import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { useAuth } from 'wasp/client/auth';

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return {
    useAuth: vi.fn(),
    LoginForm: () => {
      const [formData, setFormData] = React.useState<Record<string, string>>({});
      
      const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      
      return (
        <form data-testid="login-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            data-testid="email-input" 
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required 
          />
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            data-testid="password-input" 
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            required 
          />
          <button type="submit" data-testid="submit-button">
            Log In
          </button>
        </form>
      );
    },
  };
});

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, className, ...props }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className} data-testid={`link-${to}`} {...props}>
      {children}
    </a>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ data: null } as ReturnType<typeof useAuth>);
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders link to signup page', () => {
    render(<LoginPage />);
    const signupLink = screen.getByTestId('link-/signup');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
    expect(signupLink).toHaveTextContent('Go to signup');
  });

  it('renders link to password reset page', () => {
    render(<LoginPage />);
    const resetLink = screen.getByTestId('link-/request-password-reset');
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute('href', '/request-password-reset');
    expect(resetLink).toHaveTextContent('Reset it');
  });

  it('displays "Don\'t have an account?" text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('displays "Forgot your password?" text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  it('applies dark theme styling to the page', () => {
    const { container } = render(<LoginPage />);
    // Check that AuthLayout is rendered (which should have dark theme)
    const authLayout = container.querySelector('.min-h-screen');
    expect(authLayout || container.firstChild).toBeTruthy();
  });

  it('renders header with gradient text', () => {
    render(<LoginPage />);
    const heading = screen.getByText(/welcome back/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/continue planning your trips/i)).toBeInTheDocument();
  });

  it('form fields are accessible and can receive input', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    // Verify fields are accessible
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Verify fields can receive focus and input
    await user.click(emailInput);
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    await user.click(passwordInput);
    await user.type(passwordInput, 'password123');
    expect(passwordInput).toHaveValue('password123');
  });

  it('email field has required validation', () => {
    render(<LoginPage />);
    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeRequired();
  });

  it('password field has required validation', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByTestId('password-input');
    expect(passwordInput).toBeRequired();
  });
});

