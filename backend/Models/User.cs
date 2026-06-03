using System.Text.Json.Serialization;

namespace CarolinaRunningClub.Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;

        // Added properties to meet the Silver Challenge requirements
        public string Password { get; set; } = "password123";
        public string SecurityQuestion { get; set; } = "What was the name of your first pet?";
        public string SecurityAnswer { get; set; } = "Rex";

        public ICollection<Role> Roles { get; set; } = new List<Role>();

        [JsonIgnore] // Prevents cycles when serializing users
        public List<RunActivity> Runs { get; set; } = new();
    }
}