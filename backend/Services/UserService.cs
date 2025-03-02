using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

         public async Task<string> AddUserAsync (UserDto user)
        {
            if (user == null || user.Author.Equals(null))
            {
                return "Invalid user data.";
            }
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return "User added successfully!";
            }
            catch
            {
                return "Internal server error.";
            }
        }

        // Verifies if a user exists by author name
        public bool VerifyUser(UserDto user)
        {
            return _context.Users.Any(g => g.Author == user.Author && g.Password == user.Password);
        }
    }
}