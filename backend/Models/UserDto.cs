using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UserDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        [StringLength(100, ErrorMessage = "Author name cannot exceed 100 characters.")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(30, ErrorMessage = "Password cannot exceed 30 characters.")]
        public string Password { get; set; }
    }
}