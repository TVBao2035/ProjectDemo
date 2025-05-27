using OrderService.Repositories.Implements;
using UserService.Data;
using UserService.Models.Enities;
using UserService.Repositories.Interfaces;

namespace UserService.Repositories.Implements
{
    public class TokenRepository : GenericRepository<Token>, ITokenRepository
    {
        public TokenRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
