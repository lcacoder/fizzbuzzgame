using backend.Data;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class GameService
    {
        private readonly ApplicationDbContext _context;

        public GameService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Creates a new game if the game data is valid
        public async Task<string> CreateGameAsync(Game game)
        {
            if (game == null || game.Range == 0)
            {
                return "Invalid game data.";
            }

            try
            {
                if (game.GameRules != null)
                {
                    var rulesList = game.GetGameRules(); // Apply game rules here if necessary
                }

                _context.Games.Add(game);
                await _context.SaveChangesAsync();

                return "Game created successfully!";
            }
            catch
            {
                return "Internal server error.";
            }
        }

        // Verifies if a user exists by author name
        public bool VerifyUser(string authorName)
        {
            return _context.Games.Any(g => g.Author == authorName);
        }

        // Saves game history in the database
        public async Task<string> SaveGameAsync(History history)
        {
            if (history == null || history.GameName == null)
            {
                return "Invalid game data.";
            }

            try
            {
                _context.Histories.Add(history);
                await _context.SaveChangesAsync();
                return "Game saved successfully!";
            }
            catch
            {
                return "Internal server error.";
            }
        }

        // Retrieves all games by the specified author
        public List<History> GetAllGamesByAuthor(string author)
        {
            return _context.Histories.Where(g => g.Author == author).ToList();
        }
    }
}
