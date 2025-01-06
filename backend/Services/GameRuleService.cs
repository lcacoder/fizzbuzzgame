using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class GameRuleService
    {
        public string ApplyGameRules(int number)
        {
            string result = "";

            if (number % 7 == 0) result += "Foo";
            if (number % 11 == 0) result += "Boo";
            if (number % 101 == 0) result += "Loo";

            if (string.IsNullOrEmpty(result))
                {
                    result = number.ToString();
                }
            return result;
        }
    }
}