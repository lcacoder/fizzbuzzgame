using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class History
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string GameName { get; set; }
        public int Score { get; set; }
    }
}