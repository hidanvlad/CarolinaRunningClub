using System;
using System.Linq;
using Bogus;
using CarolinaRunningClub.Backend.Models;

namespace CarolinaRunningClub.Backend.Data
{
    public static class DbSeeder
    {
        public static void SeedData(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // Guard Clause: If runs are already there, don't generate more!
            if (context.RunActivities.Any()) return;

            Console.WriteLine("[SEEDER] Flooding database runs for load testing optimization...");

            // 1. Grab the exact users you just typed into SSMS
            var existingUsers = context.Users.ToList();

            if (!existingUsers.Any())
            {
                Console.WriteLine("[SEEDER ERROR] Stop! Please insert your accounts into SSMS first.");
                return;
            }

            // 2. Grab or fallback on Activity Types
            if (!context.ActivityTypes.Any())
            {
                context.ActivityTypes.AddRange(
                    new ActivityType { TypeName = "Sprint" },
                    new ActivityType { TypeName = "Marathon" },
                    new ActivityType { TypeName = "Trail Run" },
                    new ActivityType { TypeName = "Intervals" }
                );
                context.SaveChanges();
            }
            var activityTypes = context.ActivityTypes.ToList();

            // 3. Use Faker to instantly generate 5,000 runs assigned to your SSMS users
            var runFaker = new Faker<RunActivity>()
                .RuleFor(r => r.Name, f => f.PickRandom("Morning Jog", "Interval training", "Stadium laps", "Evening run"))
                .RuleFor(r => r.Distance, f => Math.Round(f.Random.Double(2.0, 25.0), 1))
                .RuleFor(r => r.Date, f => f.Date.Past(1))
                .RuleFor(r => r.UserId, f => f.PickRandom(existingUsers).Id) // Pulls the exact IDs from SSMS
                .RuleFor(r => r.ActivityTypeId, f => f.PickRandom(activityTypes).Id);

            var massiveRuns = runFaker.Generate(5000);
            context.RunActivities.AddRange(massiveRuns);
            context.SaveChanges();

            Console.WriteLine($"[SEEDER SUCCESS] Automatically generated {context.RunActivities.Count()} runs linked to your SSMS profiles.");
        }
    }
}