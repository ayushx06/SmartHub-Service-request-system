import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from './EmptyState.jsx';

describe('EmptyState', () => {
  it('renders the supplied title and guidance', () => {
    render(<EmptyState title="No users match your search" message="Try a different name or email." />);

    expect(screen.getByText('No users match your search')).toBeInTheDocument();
    expect(screen.getByText('Try a different name or email.')).toBeInTheDocument();
  });
});
