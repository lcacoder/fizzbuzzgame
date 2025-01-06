using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly GameRuleService _gameRuleService;
        public GameController(ApplicationDbContext context, GameRuleService gameRuleService)
        {
            _context = context;
            _gameRuleService = gameRuleService;
        }

        [HttpPost("savegame")]
        public async Task<IActionResult> SaveGame([FromBody]History history)
        {
            if (history.GameName == null)
            {
                return BadRequest("Invalid game data.");
            }
            try
            {
                Console.WriteLine(history.Author + " " + history.GameName + " " + history.Score);
                // _context.Histories.Add(history);
                // await _context.SaveChangesAsync();
                return Ok(new { message = "Game saved successfully!" });;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("verifymember")]
        public IActionResult VerifyMember([FromBody] string authorName)
        {
            Console.WriteLine(authorName);
            if (string.IsNullOrWhiteSpace(authorName))
            {
                return BadRequest(new { message = "Author name is required." });
            }

            bool userExists = _context.Games.Any(g => g.Author == authorName);
            if (!userExists)
            {
                return BadRequest(new { message = "Invalid user." });
            }

            return Ok(new { message = "User verified successfully." });
        }

        [HttpPost("validate")]
        public IActionResult ValidateAnswer([FromBody] AnswerDto answerDto)
        {
            if (answerDto.Number <= 0 || string.IsNullOrWhiteSpace(answerDto.Answer))
            {
                return BadRequest(new { message = "Invalid input." });
            }
            string expected = _gameRuleService.ApplyGameRules(answerDto.Number);
            // Console.WriteLine($"Expected: '{expected}', Provided Answer: '{answerDto.Answer}'");
            bool isCorrect = string.Equals(expected, answerDto.Answer, StringComparison.OrdinalIgnoreCase);

            return Ok(new ValidationResult
            {
                IsCorrect = isCorrect,
                Expected = expected
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody]Game game)
        {
            if (game.Range == 0)
            {
                return BadRequest("Invalid game data.");
            }
            try
            {
                if (game.GameRules != null)
                {
                    // Optionally, you can check if the GameRules are correctly parsed
                    var rulesList = game.GetGameRules();
                }
                // _context.Games.Add(game);
                // await _context.SaveChangesAsync();
                return Ok(new { message = "Game created successfully!" });;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getallgames")]
        public IActionResult GetAllGamesByAuthor(string author)
        {
            var games = _context.Histories.Where(g => g.Author == author).ToList();
            return Ok(games);
        }
    }
}