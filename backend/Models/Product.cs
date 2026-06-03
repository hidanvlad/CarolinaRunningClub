// Models/Product.cs
using System.ComponentModel.DataAnnotations;

namespace CarolinaRunningClub.Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public double Price { get; set; }

        [Required]
        public string ImageUrl { get; set; } = null!;
    }
}