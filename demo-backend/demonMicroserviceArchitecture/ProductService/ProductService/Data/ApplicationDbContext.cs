using Microsoft.EntityFrameworkCore;
using ProductService.Models.Enities;

namespace ProductService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        DbSet<Product>Products { get; set; }
    }
}
