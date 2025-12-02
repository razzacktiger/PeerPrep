import { useState, useEffect } from 'react';
import { findPotentialMatches, requestMatchWithSession } from '../api/matching';
import { ScheduledSession } from '../types';

export function usePotentialMatches() {
  const [potentialMatches, setPotentialMatches] = useState<ScheduledSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await findPotentialMatches();
      if (result.data) {
        setPotentialMatches(result.data);
      } else {
        setError(result.error || 'Failed to fetch matches');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const requestMatch = async (sessionId: string) => {
    setRequesting(sessionId);
    setError(null);

    try {
      const result = await requestMatchWithSession(sessionId);
      if (result.data) {
        // Refresh matches after successful request
        await fetchMatches();
        return true;
      } else {
        setError(result.error || 'Failed to request match');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setRequesting(null);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    potentialMatches,
    loading,
    error,
    requesting,
    refetch: fetchMatches,
    requestMatch,
  };
}