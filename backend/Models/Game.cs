using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace backend.Models
{
    public class Game
    {
        public int Id { get; set; }
        [Required]
        public string Author { get; set; }
        [Required]
        public string GameName { get; set; }
        [Required]
        public string GameRules { get; set; } = string.Empty;
        public List<string> GetGameRules()
        {
            return string.IsNullOrEmpty(GameRules) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(GameRules);
        }

        public void SetGameRules(List<string> rules)
        {
            GameRules = JsonSerializer.Serialize(rules);
        }
        public int Range { get; set; }
    }
}