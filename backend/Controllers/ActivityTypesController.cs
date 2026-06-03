using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityTypesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityType>>> GetActivityTypes()
        {
            return await _context.ActivityTypes.ToListAsync();
        }
    }
}