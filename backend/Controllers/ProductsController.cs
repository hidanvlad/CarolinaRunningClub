using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;

            // DYNAMIC INLINE AUTO-SEEDER: Guarantees your database has products right out of the box!
            if (!_context.Products.Any())
            {
                _context.Products.AddRange(new List<Product>
                {
                    new Product { Name = "Tricou Carolina Running Club - Alb", Price = 59.99, ImageUrl = "http://localhost:5048/images/tricou-alb.jpg" },
                    new Product { Name = "Tricou Carolina Running Club - Negru", Price = 59.99, ImageUrl = "http://localhost:5048/images/tricou-negru.jpg" },
                    new Product { Name = "Șapcă Oficială CRC - Ediție Limitată", Price = 24.99, ImageUrl = "http://localhost:5048/images/sapca.jpg" },
                    new Product { Name = "Bidon Apă Termos CRC", Price = 19.99, ImageUrl = "http://localhost:5048/images/bidon.jpg" }
                });
                _context.SaveChanges();
            }
        }

        // GET: api/Products
        [HttpGet]
        [AllowAnonymous] // Anyone browsing the landing page or shop can read the active catalog
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // POST: api/Products
        [HttpPost]
        [Authorize(Roles = "Admin")] // Locked down: Only validated administrators can execute creations
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Locked down: Only validated administrators can execute data changes
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id) return BadRequest();

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Locked down: Only validated administrators can remove stock rows
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}