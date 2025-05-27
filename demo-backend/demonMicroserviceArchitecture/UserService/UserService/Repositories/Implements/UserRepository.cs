using OrderService.Repositories.Implements;
using UserService.Data;
using UserService.Models.Enities;
using UserService.Repositories.Interfaces;

namespace UserService.Repositories.Implements
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
