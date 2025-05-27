using OrderService.Data;
using OrderService.Models.Enities;
using OrderService.Repositories.Interfaces;

namespace OrderService.Repositories.Implements
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
