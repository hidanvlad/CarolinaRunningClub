using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory; // Maintained for IMemoryCache tracking

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Protects all execution logic from unauthenticated requests
    public class RunActivitiesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache; // Maintained for Gold Caching Challenge optimization

        // Constructor completely configured with Dependency Injection
        public RunActivitiesController(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        // GOLD: Secure Real-Time Stealth Logging upgraded with Aggressive Burst Detection
        private async Task LogAction(string actionDescription)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userNameClaim = User.FindFirst(ClaimTypes.Name)?.Value ?? "Guest/Unknown";
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

            if (int.TryParse(userIdClaim, out int actorId))
            {
                int? dbUserId = (actorId == 0) ? null : actorId;

                var log = new ActionLog
                {
                    UserId = dbUserId,
                    UserRole = userRoleClaim,
                    ActionDescription = actionDescription,
                    Timestamp = DateTime.Now
                };
                _context.ActionLogs.Add(log);
                await _context.SaveChangesAsync();

                if (actionDescription.Contains("Deleted"))
                {
                    var botAttackWindow = DateTime.Now.AddSeconds(-60);

                    var recentRapidDeletions = await _context.ActionLogs
                        .CountAsync(l => l.UserId == dbUserId &&
                                         l.ActionDescription.Contains("Deleted") &&
                                         l.Timestamp > botAttackWindow);

                    Console.WriteLine($"[SECURITY MONITOR] User {userNameClaim} (ID: {actorId}) executed {recentRapidDeletions} deletions within the last 60 seconds.");

                    if (recentRapidDeletions >= 3)
                    {
                        var existingEntry = await _context.ObservationList.FirstOrDefaultAsync(o => o.UserId == dbUserId);

                        if (existingEntry == null)
                        {
                            _context.ObservationList.Add(new ObservationEntry
                            {
                                UserId = dbUserId,
                                UserName = userNameClaim,
                                Reason = "CRITICAL: Automated Malicious Bot Pattern Detected (3+ Deletions in under 60 seconds).",
                                DetectionTimestamp = DateTime.Now
                            });
                            await _context.SaveChangesAsync();
                            Console.WriteLine($"[ALERT FLAG] Account '{userNameClaim}' has been locked into the Observation List via Real-Time Infrastructure Gating.");
                        }
                    }
                }
            }
        }

        // --- PART 1: PUBLIC UNAUTHENTICATED STATISTICS GATEWAY FOR LANDING PAGE ---
        [HttpGet("public-summary")]
        [AllowAnonymous] // Anyone visiting the landing page can pull down core counts without an auth token
        public async Task<IActionResult> GetPublicSummary()
        {
            // Gather structural calculations across all 5000+ random rows on the fly
            var realTotalKm = await _context.RunActivities.AnyAsync()
                ? await _context.RunActivities.SumAsync(r => r.Distance)
                : 0.0;

            var realTotalRunners = await _context.Users.CountAsync();

            // Calculate mock unique organized activities metrics relative to DB configurations
            var calculatedEvents = await _context.RunActivities.Select(r => r.Name).Distinct().CountAsync() + 12;

            return Ok(new
            {
                TotalKm = Math.Round(realTotalKm, 1),
                TotalRunners = realTotalRunners,
                TotalEvents = calculatedEvents
            });
        }

        // --- GOLD CHALLENGE ENDPOINT: HEAVILY COMPUTATIONAL STATS WITH CACHING DEFENSE ---
        [HttpGet("heavy-leaderboard")]
        [AllowAnonymous] // Allows JMeter scripts to run without embedding authorization headers
        public async Task<IActionResult> GetHeavyLeaderboard([FromQuery] bool useCache = false)
        {
            const string cacheKey = "GoldLeaderboardStatsCache";

            if (useCache)
            {
                if (_cache.TryGetValue(cacheKey, out List<LeaderboardDto>? cachedData))
                {
                    Console.WriteLine("[GOLD CACHE HIT] Serving heavy aggregated statistics instantly from RAM.");
                    return Ok(cachedData);
                }

                var computedStats = await ComputeComplexStatsAsync();

                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromSeconds(60));

                _cache.Set(cacheKey, computedStats, cacheOptions);
                return Ok(computedStats);
            }

            Console.WriteLine("[GOLD WARNING] Naive execution pathway triggered. recalculating directly on DB...");
            var freshStats = await ComputeComplexStatsAsync();
            return Ok(freshStats);
        }

        private async Task<List<LeaderboardDto>> ComputeComplexStatsAsync()
        {
            return await _context.RunActivities
                .GroupBy(r => new { r.UserId, r.Name })
                .Select(g => new LeaderboardDto
                {
                    RunnerId = g.Key.UserId,
                    RunTitle = g.Key.Name,
                    TotalDistance = g.Sum(r => r.Distance),
                    AverageDistance = g.Average(r => r.Distance),
                    TotalActivitiesRecorded = g.Count(),
                    ComplexityFactor = Math.Sqrt(g.Sum(r => r.Distance * r.Distance))
                })
                .OrderByDescending(o => o.TotalDistance)
                .ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RunActivity>>> GetRunActivities() => await _context.RunActivities.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<RunActivity>> PostRunActivity(RunActivity runActivity)
        {
            if (runActivity.UserId == 0) runActivity.UserId = null;

            _context.RunActivities.Add(runActivity);
            await _context.SaveChangesAsync();

            await LogAction($"Created new Run: {runActivity.Name}");

            return CreatedAtAction("GetRunActivity", new { id = runActivity.Id }, runActivity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRunActivity(int id, RunActivity runActivity)
        {
            if (id != runActivity.Id) return BadRequest();

            if (runActivity.UserId == 0) runActivity.UserId = null;

            _context.Entry(runActivity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await LogAction($"Edited Run ID: {id} (Name: {runActivity.Name})");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRunActivity(int id)
        {
            var runActivity = await _context.RunActivities.FindAsync(id);
            if (runActivity == null) return NotFound();

            string runName = runActivity.Name;
            _context.RunActivities.Remove(runActivity);
            await _context.SaveChangesAsync();

            await LogAction($"Deleted Run: {runName}");

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RunActivity>> GetRunActivity(int id)
        {
            var runActivity = await _context.RunActivities.FindAsync(id);
            return runActivity == null ? NotFound() : runActivity;
        }

        [HttpGet("long-runs")]
        public async Task<ActionResult<IEnumerable<RunActivity>>> GetLongRuns([FromQuery] double minDistance)
        {
            return await _context.RunActivities
                .Where(r => r.Distance >= minDistance)
                .ToListAsync();
        }

        [HttpGet("total-distance")]
        public async Task<ActionResult<double>> GetTotalDistance()
        {
            return await _context.RunActivities.SumAsync(r => r.Distance);
        }
    }

    public class LeaderboardDto
    {
        public int? RunnerId { get; set; }
        public string RunTitle { get; set; } = null!;
        public double TotalDistance { get; set; }
        public double AverageDistance { get; set; }
        public int TotalActivitiesRecorded { get; set; }
        public double ComplexityFactor { get; set; }
    }
}