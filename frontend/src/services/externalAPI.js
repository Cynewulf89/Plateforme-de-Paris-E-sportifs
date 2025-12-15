// Mock external esports API service
class ExternalEsportsAPI {
  constructor() {
    this.baseURL = 'https://api.mockesports.com'; // Mock URL for demo
  }

  // Get live match results
  async getLiveResults() {
    try {
      // In a real implementation, this would call a real API
      // For demo purposes, we'll return mock data
      const mockResults = [
        {
          id: 1,
          team1: 'Cloud9',
          team2: 'FaZe Clan',
          score1: 16,
          score2: 14,
          status: 'live',
          game: 'CS2',
          tournament: 'BLAST Premier'
        },
        {
          id: 2,
          team1: 'G2 Esports',
          team2: 'Team Vitality',
          score1: 13,
          score2: 16,
          status: 'finished',
          winner: 'Team Vitality',
          game: 'CS2',
          tournament: 'BLAST Premier'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockResults;
    } catch (error) {
      console.error('Erreur API externe:', error);
      throw error;
    }
  }

  // Get upcoming matches
  async getUpcomingMatches() {
    try {
      const mockMatches = [
        {
          id: 3,
          team1: 'Astralis',
          team2: 'Natus Vincere',
          date: '2025-12-20T19:00:00Z',
          game: 'CS2',
          tournament: 'ESL Pro League'
        },
        {
          id: 4,
          team1: 'Fnatic',
          team2: 'Team Liquid',
          date: '2025-12-21T21:00:00Z',
          game: 'CS2',
          tournament: 'ESL Pro League'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMatches;
    } catch (error) {
      console.error('Erreur API externe:', error);
      throw error;
    }
  }

  // Get team statistics
  async getTeamStats(teamName) {
    try {
      const mockStats = {
        name: teamName,
        wins: Math.floor(Math.random() * 50) + 20,
        losses: Math.floor(Math.random() * 30) + 10,
        winRate: Math.floor(Math.random() * 30) + 60,
        ranking: Math.floor(Math.random() * 20) + 1
      };

      await new Promise(resolve => setTimeout(resolve, 600));
      return mockStats;
    } catch (error) {
      console.error('Erreur API externe:', error);
      throw error;
    }
  }
}

export const externalAPI = new ExternalEsportsAPI();