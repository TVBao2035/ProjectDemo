using OrderService.Repositories.Implements;
using ProductService.Data;
using ProductService.Models.Enities;
using ProductService.Repositories.Interfaces;

namespace ProductService.Repositories.Implements
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
