using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActionLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActionLogsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ActionLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActionLog>>> GetLogs()
        {
            // We return the most recent logs first
            return await _context.ActionLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(50) // Limit to the last 50 actions
                .ToListAsync();
        }
    }
}