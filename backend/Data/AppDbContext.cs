using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Models;
using System.Collections.Generic;

namespace CarolinaRunningClub.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Core Tables
        public DbSet<User> Users { get; set; }
        public DbSet<RunActivity> RunActivities { get; set; }
        public DbSet<ActivityType> ActivityTypes { get; set; }

        // Silver Challenge: Role & Permission Infrastructure 
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }

        // Gold Challenge: Logging & Stealth Infrastructure 
        public DbSet<ActionLog> ActionLogs { get; set; }
        public DbSet<ObservationEntry> ObservationList { get; set; }

        public DbSet<Product> Products { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Many-to-Many: Roles and Permissions
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Permissions)
                .WithMany(p => p.Roles)
                .UsingEntity<Dictionary<string, object>>(
                    "RolePermissions",
                    j => j.HasOne<Permission>().WithMany().HasForeignKey("PermissionId"),
                    j => j.HasOne<Role>().WithMany().HasForeignKey("RoleId")
                );

            // Many-to-Many: Users and Roles 
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserRoles",
                    j => j.HasOne<Role>().WithMany().HasForeignKey("RoleId"),
                    j => j.HasOne<User>().WithMany().HasForeignKey("UserId")
                );
        }
    }
}