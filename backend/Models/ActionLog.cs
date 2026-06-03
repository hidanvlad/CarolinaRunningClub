using System;

namespace CarolinaRunningClub.Backend.Models
{
    public class ActionLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string UserRole { get; set; } = string.Empty;
        public string ActionDescription { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}