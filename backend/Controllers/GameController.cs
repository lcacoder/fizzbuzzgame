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
        
        private readonly UserService _userService;

        public GameController(GameService gameService, GameRuleService gameRuleService, UserService userService)
        {
            _gameService = gameService;
            _gameRuleService = gameRuleService;
            _userService = userService;
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

        [HttpPost("register")]
        public async Task<IActionResult> AddUser([FromBody] UserDto user) 
        {
            var result = await _userService.AddUserAsync(user);
            if(result == "User added successfully!")
            {
                return Ok(new {message = result });
            }
            return BadRequest(new { message = result });
        }

        [HttpPost("verifymember")]
        public IActionResult VerifyMember([FromBody] UserDto user)
        {
            if (user.Author == null)
            {
                return BadRequest(new { message = "Author name is required." });
            }

            bool userExists = _userService.VerifyUser(user);
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
            Console.WriteLine(author);
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

