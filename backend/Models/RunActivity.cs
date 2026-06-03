namespace CarolinaRunningClub.Backend.Models
{
    public class RunActivity
    {
        public int Id { get; set; }
        public string Name { get; set; } // Add this line
        public double Distance { get; set; }
        public DateTime Date { get; set; }
        public int? UserId { get; set; }
        public int ActivityTypeId { get; set; }
    }
}
