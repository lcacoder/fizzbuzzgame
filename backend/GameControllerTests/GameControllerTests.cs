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
        private readonly Mock<GameRuleService> _mockGameRuleService;
        private readonly GameController _controller;

        public GameControllerTests()
        {
            // Create in-memory database options for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("TestDatabase") // In-memory database for tests
                .Options;

            // Create a new context instance with the in-memory database
            _context = new ApplicationDbContext(options);

            // Initialize the mock GameRuleService
            _mockGameRuleService = new Mock<GameRuleService>();

            // Instantiate the GameController with the in-memory ApplicationDbContext and mocked GameRuleService
            _controller = new GameController(_context, _mockGameRuleService.Object);
        }

        // Helper method to create a mock DbSet from an IQueryable data source
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
            // Arrange
            var game = new Game { Author = "Lee", GameName = "ForFun", Range = 10 };

            // Act
            var result = await _controller.CreateGame(game);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void VerifyMember_UserExists_ReturnsOk()
        {
            // Arrange
            string authorName = "Test Author";
            var games = new List<Game> { new Game { Author = authorName } }.AsQueryable();
            var mockSet = CreateMockDbSet(games);

            _context.Games = mockSet.Object;

            // Act
            var result = _controller.VerifyMember(authorName);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void ValidateAnswer_CorrectAnswer_ReturnsCorrectValidationResult()
        {
            // Arrange
            var answerDto = new AnswerDto { Number = 7, Answer = "Foo" };
            _mockGameRuleService.Setup(service => service.ApplyGameRules(7)).Returns("Foo");

            // Act
            var result = _controller.ValidateAnswer(answerDto) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var validationResult = Assert.IsType<ValidationResult>(result.Value);
            Assert.True(validationResult.IsCorrect);
        }

        [Fact]
        public async Task SaveGame_ValidHistory_ReturnsOk()
        {
            // Arrange
            var history = new History { GameName = "Test Game", Author = "Test Author", Score = 100 };
            var historyList = new List<History> { history }.AsQueryable();
            var mockHistorySet = CreateMockDbSet(historyList);

            _context.Histories = mockHistorySet.Object;

            // Act
            var result = await _controller.SaveGame(history);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void GetAllGamesByAuthor_ReturnsGames()
        {
            // Arrange
            string authorName = "Test Author";
            var games = new List<Game>
            {
                new Game { Author = authorName, GameName = "Game1", Range = 10 },
                new Game { Author = authorName, GameName = "Game2", Range = 20 }
            }.AsQueryable();

            var mockSet = CreateMockDbSet(games);
            _context.Games = mockSet.Object;

            // Act
            var result = _controller.GetAllGamesByAuthor(authorName);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
