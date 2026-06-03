namespace CarolinaRunningClub.Backend.Models
{
    public class Permission
    {

        public int Id { get; set; }
        public string PermissionName { get; set; } = string.Empty;
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
