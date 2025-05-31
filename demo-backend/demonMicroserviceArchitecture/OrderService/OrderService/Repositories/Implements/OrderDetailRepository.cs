using OrderService.Data;
using OrderService.Models.Enities;
using OrderService.Repositories.Interfaces;

namespace OrderService.Repositories.Implements
{
    public class OrderDetailRepository : GenericRepository<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
