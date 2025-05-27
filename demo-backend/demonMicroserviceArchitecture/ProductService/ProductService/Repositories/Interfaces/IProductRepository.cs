using OrderService.Repositories.Interfaces;
using ProductService.Models.Enities;

namespace ProductService.Repositories.Interfaces
{
    public interface IProductRepository:IGenericRepository<Product>
    {
    }
}
