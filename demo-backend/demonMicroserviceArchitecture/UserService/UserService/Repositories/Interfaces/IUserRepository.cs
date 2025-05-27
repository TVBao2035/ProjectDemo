using OrderService.Repositories.Interfaces;
using UserService.Models.Enities;

namespace UserService.Repositories.Interfaces
{
    public interface IUserRepository:IGenericRepository<User>
    {
    }
}
