using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
     public class ValidationResult
    {
        public bool IsCorrect { get; set; }
        public string Expected { get; set; }
    }
}