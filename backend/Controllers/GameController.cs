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
        private readonly GameService _gameService;
        private readonly GameRuleService _gameRuleService;

        public GameController(GameService gameService, GameRuleService gameRuleService)
        {
            _gameService = gameService;
            _gameRuleService = gameRuleService;
        }

        [HttpPost("creategame")]
        public async Task<IActionResult> CreateGame([FromBody] Game game)
        {
            var result = await _gameService.CreateGameAsync(game);
            if (result == "Game created successfully!")
            {
                return Ok(new { message = result });
            }

            return BadRequest(new { message = result });
        }

        [HttpPost("verifymember")]
        public IActionResult VerifyMember([FromBody] string authorName)
        {
            if (string.IsNullOrWhiteSpace(authorName))
            {
                return BadRequest(new { message = "Author name is required." });
            }

            bool userExists = _gameService.VerifyUser(authorName);
            if (!userExists)
            {
                return NotFound(new { message = "User does not exist." }); // Changed to NotFound
            }

            return Ok(new { message = "User verified successfully." });
        }

        [HttpPost("validate")]
        public IActionResult ValidateAnswer([FromBody] AnswerDto answerDto)
        {
            if (answerDto == null || answerDto.Number <= 0 || string.IsNullOrWhiteSpace(answerDto.Answer)) // Added null check for answerDto
            {
                return BadRequest(new { message = "Invalid input." });
            }

            string expected = _gameRuleService.ApplyGameRules(answerDto.Number);
            bool isCorrect = string.Equals(expected, answerDto.Answer, StringComparison.OrdinalIgnoreCase);

            return Ok(new ValidationResult
            {
                IsCorrect = isCorrect,
                Expected = expected
            });
        }

        [HttpPost("savegame")]
        public async Task<IActionResult> SaveGame([FromBody] History history)
        {
            var result = await _gameService.SaveGameAsync(history);
            if (result == "Game saved successfully!")
            {
                return Ok(new { message = result });
            }

            return BadRequest(new { message = result });
        }

        [HttpGet("getallgames")]
        public IActionResult GetAllGamesByAuthor(string author)
        {
            if (string.IsNullOrWhiteSpace(author)) // Added a check for an empty author parameter
            {
                return BadRequest(new { message = "Author name is required." });
            }

            var games = _gameService.GetAllGamesByAuthor(author);
            if (games == null || !games.Any()) // If no games are found
            {
                return NotFound(new { message = "No games found for the author." }); // Changed to NotFound
            }

            return Ok(games);
        }
    }
}

