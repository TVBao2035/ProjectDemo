using ProductService.Models.DTOs;
using ProductService.Models.Enities;

namespace ProductService.Services.Interfaces
{
    public interface IProductService
    {
        Task<AppReponse<ProductDTO>> Create(ProductDTO request);
        Task<AppReponse<ProductDTO>> Update(Product request);
        Task<AppReponse<ProductDTO>> Delete(Guid Id);
        Task<AppReponse<List<Product>>> GetAll();
        Task<AppReponse<Product>> GetById(Guid Id);
    }
}
