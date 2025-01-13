using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class GameRuleService
    {
        private readonly List<(int Divisor, string Result)> _rules;

        public GameRuleService(IConfiguration configuration)
        {
            // Load rules from appsettings.json
            _rules = configuration.GetSection("GameRules")
                .Get<List<GameRule>>()
                .Select(rule => (rule.Divisor, rule.Result))
                .ToList();
        }

        public virtual string ApplyGameRules(int number)
        {
            string result = "";

            foreach (var rule in _rules)
            {
                if (number % rule.Divisor == 0)
                {
                    result += rule.Result;
                }
            }

            if (string.IsNullOrEmpty(result))
            {
                result = number.ToString();
            }

            return result;
        }
    }

    // Helper class for deserializing the rules from the configuration file
    public class GameRule
    {
        public int Divisor { get; set; }
        public string Result { get; set; }
    }
}
