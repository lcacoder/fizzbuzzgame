using backend.Controllers;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace backend.GameControllerTests
{
    public class GameControllerTests
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<GameService> _mockGameService;
        private readonly Mock<GameRuleService> _mockGameRuleService;
        private readonly GameController _controller;

        public GameControllerTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);

            _mockGameService = new Mock<GameService>(_context);
            _mockGameRuleService = new Mock<GameRuleService>();

            _controller = new GameController(_mockGameService.Object, _mockGameRuleService.Object);
        }

        private static Mock<DbSet<T>> CreateMockDbSet<T>(IQueryable<T> data) where T : class
        {
            var mockSet = new Mock<DbSet<T>>();
            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
            return mockSet;
        }

        [Fact]
        public async Task CreateGame_ValidGame_ReturnsOk()
        {
            var game = new Game { Author = "Lee", GameName = "ForFun", Range = 10 };

            var result = await _controller.CreateGame(game);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task CreateGame_MissingAuthor_ReturnsBadRequest()
        {
            var game = new Game { GameName = "ForFun", Range = 10 };

            var result = await _controller.CreateGame(game);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateGame_MissingGameName_ReturnsBadRequest()
        {
            var game = new Game { Author = "Lee", Range = 10 };

            var result = await _controller.CreateGame(game);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateGame_MissingRange_ReturnsBadRequest()
        {
            var game = new Game { Author = "Lee", GameName = "ForFun" };

            var result = await _controller.CreateGame(game);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateGame_InvalidGame_ReturnsBadRequest()
        {
            Game game = null;

            var result = await _controller.CreateGame(game);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void VerifyMember_UserExists_ReturnsOk()
        {
            string authorName = "Test Author";
            var games = new List<Game> { new Game { Author = authorName } }.AsQueryable();
            var mockSet = CreateMockDbSet(games);

            _context.Games = mockSet.Object;

            var result = _controller.VerifyMember(authorName);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void VerifyMember_UserDoesNotExist_ReturnsNotFound()
        {
            string authorName = "Nonexistent Author";
            var result = _controller.VerifyMember(authorName);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void ValidateAnswer_CorrectAnswer_ReturnsCorrectValidationResult()
        {
            var answerDto = new AnswerDto { Number = 7, Answer = "Foo" };
            _mockGameRuleService.Setup(service => service.ApplyGameRules(7)).Returns("Foo");

            var result = _controller.ValidateAnswer(answerDto) as OkObjectResult;

            Assert.NotNull(result);
            var validationResult = Assert.IsType<ValidationResult>(result.Value);
            Assert.True(validationResult.IsCorrect);
        }

        [Fact]
        public void ValidateAnswer_IncorrectAnswer_ReturnsIncorrectValidationResult()
        {
            var answerDto = new AnswerDto { Number = 7, Answer = "Wrong Answer" };
            _mockGameRuleService.Setup(service => service.ApplyGameRules(7)).Returns("Foo");

            var result = _controller.ValidateAnswer(answerDto) as OkObjectResult;

            Assert.NotNull(result);
            var validationResult = Assert.IsType<ValidationResult>(result.Value);
            Assert.False(validationResult.IsCorrect);
        }

        [Fact]
        public void ValidateAnswer_InvalidAnswer_ReturnsBadRequest()
        {
            AnswerDto answerDto = null;

            var result = _controller.ValidateAnswer(answerDto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SaveGame_ValidHistory_ReturnsOk()
        {
            var history = new History { GameName = "Test Game", Author = "Test Author", Score = 100 };
            var historyList = new List<History> { history }.AsQueryable();
            var mockHistorySet = CreateMockDbSet(historyList);

            _context.Histories = mockHistorySet.Object;

            var result = await _controller.SaveGame(history);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task SaveGame_MissingGameName_ReturnsBadRequest()
        {
            var history = new History { Author = "Test Author", Score = 100 };

            var result = await _controller.SaveGame(history);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SaveGame_MissingAuthor_ReturnsBadRequest()
        {
            var history = new History { GameName = "Test Game", Score = 100 };

            var result = await _controller.SaveGame(history);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void GetAllGamesByAuthor_ReturnsGames()
        {
            string authorName = "Test Author";
            var histories = new List<History>
            {
                new History { Author = authorName, GameName = "Game1", Score = 10 },
                new History { Author = authorName, GameName = "Game2", Score = 20 }
            }.AsQueryable();

            var mockHistorySet = CreateMockDbSet(histories);
            _context.Histories = mockHistorySet.Object;

            var result = _controller.GetAllGamesByAuthor(authorName);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void GetAllGamesByAuthor_NoGames_ReturnsNotFound()
        {
            string authorName = "Nonexistent Author";

            var result = _controller.GetAllGamesByAuthor(authorName);

            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
