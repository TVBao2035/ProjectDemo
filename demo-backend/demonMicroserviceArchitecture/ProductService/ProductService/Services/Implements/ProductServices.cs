using Microsoft.EntityFrameworkCore;
using ProductService.Models.DTOs;
using ProductService.Models.Enities;
using ProductService.Repositories.Interfaces;
using ProductService.Services.Interfaces;

namespace ProductService.Services.Implements
{
    public class ProductServices : IProductService
    {
        private IProductRepository _productRepository;

        public ProductServices(IProductRepository productRepository) {
            _productRepository = productRepository; ;
        }

        public async Task<AppReponse<Product>> GetById(Guid Id)
        {
            var result = new AppReponse<Product>();
            try
            {
                Product product = await _productRepository.Query(p => p.Id == Id).FirstOrDefaultAsync();
                if (product is null) return result.SendReponse(404, "Not found product");
                return result.SendReponse(200, "Success", product);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
        public async Task<AppReponse<ProductDTO>> Create(ProductDTO request)
        {
            var result = new AppReponse<ProductDTO>();
            try
            {
                Product product = await _productRepository.Query(p => p.Name.Equals(request.Name)).FirstOrDefaultAsync();
                if(product is not  null)
                {
                    return result.SendReponse(404, "Product is existing");
                }

                product = new Product();
                product.Id = Guid.NewGuid();
                product.Name = request.Name;
                product.Price = request.Price;
                _productRepository.Insert(product);
                return result.SendReponse(200, "Success", request);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<ProductDTO>> Delete(Guid Id)
        {
            var result = new AppReponse<ProductDTO>();
            try
            {
                Product product = await _productRepository.Query(p => p.Id == Id).FirstOrDefaultAsync();
                if(product is null)
                {
                    return result.SendReponse(404, "Not found product");
                }
                _productRepository.Delete(product);
                return result.SendReponse(200, "Success", new ProductDTO
                {
                    Name = product.Name,
                    Price = product.Price,
                });
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<List<Product>>> GetAll()
        {
            var result = new AppReponse<List<Product>>();
            try
            {
                List<Product> products = await _productRepository.Query().ToListAsync();

                return result.SendReponse(200, "Success", products);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<ProductDTO>> Update(Product request)
        {
            var result = new AppReponse<ProductDTO>();
            try
            {
                Product product = await _productRepository.Query(p => p.Id == request.Id).FirstOrDefaultAsync();
                if(product is null)
                {
                    return result.SendReponse(404, "Not found product");
                }

                product.Price = request.Price;
                product.Name = request.Name;
                _productRepository.Update(product);
                return result.SendReponse(200, "Success", new ProductDTO
                {
                    Name = product.Name,
                    Price = product.Price,
                });
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
    }
}
