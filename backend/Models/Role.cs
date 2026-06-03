using System.Text.Json.Serialization; // Add this using

namespace CarolinaRunningClub.Backend.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;

        [JsonIgnore] // GOLD FIX: Prevents infinite loops during JSON serialization
        public ICollection<User> Users { get; set; } = new List<User>();

        public ICollection<Permission> Permissions { get; set; } = new List<Permission>();
    }
}