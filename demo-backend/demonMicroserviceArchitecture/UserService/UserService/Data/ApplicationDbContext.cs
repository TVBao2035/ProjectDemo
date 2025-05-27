using Microsoft.EntityFrameworkCore;
using UserService.Models.Enities;

namespace UserService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        DbSet<User> User { get; set; }
        DbSet<Token> Token { get; set; }
    }
}
