using Microsoft.AspNetCore.Mvc;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimulationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private static bool _isSimulating = false;

        // We inject the database context here
        public SimulationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("start")]
        public async Task<IActionResult> Start()
        {
            _isSimulating = true;

            // To make it "do something" immediately, we add one random run
            var random = new Random();
            var newRun = new RunActivity
            {
                Name = "Simulated Fast Run",
                Distance = random.Next(5, 15), // Random distance between 5 and 15km
                Date = DateTime.Now,
                UserId = 1, // Assigns to your first runner (Hidan Vlad)
                ActivityTypeId = random.Next(1, 4) // Assigns a random type from your DB
            };

            _context.RunActivities.Add(newRun);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Simulation started and data generated." });
        }

        [HttpPost("stop")]
        public IActionResult Stop()
        {
            _isSimulating = false;
            return Ok(new { message = "Simulation stopped." });
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { active = _isSimulating });
        }
    }
}