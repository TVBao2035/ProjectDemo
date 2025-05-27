using Microsoft.EntityFrameworkCore;
using OrderService.Models.Enities;

namespace OrderService.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options) : base(options)
        {
        }

        DbSet<Order> Order { get; set; }
    }
}
