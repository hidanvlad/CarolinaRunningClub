using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // ENSURE THIS IS PRESENT
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObservationListController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ObservationListController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObservationEntry>>> GetObservationList()
        {
            // Adding <ObservationEntry> explicitly fixes the CS0411 error
            return await _context.ObservationList
                .OrderByDescending(o => o.DetectionTimestamp)
                .ToListAsync<ObservationEntry>();
        }
    }
}