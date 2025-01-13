using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace backend.Models
{
    public class Game
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        [StringLength(100, ErrorMessage = "Author name cannot exceed 100 characters.")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Game name is required.")]
        [StringLength(200, ErrorMessage = "Game name cannot exceed 200 characters.")]
        public string GameName { get; set; }

        [Required(ErrorMessage = "Game rules are required.")]
        public string GameRules { get; set; } = string.Empty;

        // Method to get the deserialized game rules list
        public List<string> GetGameRules()
        {
            return string.IsNullOrEmpty(GameRules) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(GameRules);
        }

        // Method to set game rules as a serialized JSON string
        public void SetGameRules(List<string> rules)
        {
            GameRules = JsonSerializer.Serialize(rules);
        }

        [Range(1, int.MaxValue, ErrorMessage = "Range must be a positive integer.")]
        public int Range { get; set; }
    }
}
