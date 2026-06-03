using System;

namespace CarolinaRunningClub.Backend.Models
{
    public class ObservationEntry
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public DateTime DetectionTimestamp { get; set; } = DateTime.Now;
    }
}