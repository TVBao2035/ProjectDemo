using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ProductService.Models.DTOs;
using ProductService.Models.Enities;
using ProductService.Repositories.Interfaces;
using ProductService.Services.Interfaces;
using UserService.Models.DTOs;
using UserService.Models.Requests;
using UserService.Models.Responses;

namespace ProductService.Services.Implements
{
    public class ProductServices : IProductService
    {
        private IProductRepository _productRepository;

        public ProductServices(IProductRepository productRepository) {
            _productRepository = productRepository; ;
        }


        public async Task<AppReponse<SearchResponse<ProductDetailModal>>> Search(SearchRequest request)
        {
            var result = new AppReponse<SearchResponse<ProductDetailModal>>();
            try
            {
                SearchResponse<ProductDetailModal> reponse = new SearchResponse<ProductDetailModal>();
                reponse.SearchData = new List<ProductDetailModal>();
                var query = GetQuerySearch(request.Filters);

                query = GetQuerySort(request.Sort, query);

                int pageSize = request.PageSize;
                int currPage = request.PageIndex - 1;
                int skip = pageSize * currPage;
                int totalPage = (query.Count() / request.PageSize);
                if ((query.Count() % request.PageSize != 0)) totalPage++;

                query = query.Skip(skip).Take(pageSize);
                var products = query.Select(p => new ProductDetailModal
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price
                }).ToList();


                if (currPage > totalPage) currPage = totalPage;
                reponse.SearchData = products;
                reponse.PageIndex = currPage + 1;
                reponse.TotalPages = totalPage;


                return result.SendReponse(200, "Success", reponse);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public IQueryable<Product> GetQuerySort(SortOrder order, IQueryable<Product> query)
        {
            if (order is not null)
            {
                var param = Expression.Parameter(typeof(Product), "m");
                var property = Expression.Property(param, order.FieldName);
                var converted = Expression.Convert(property, typeof(object));
                var lambda = Expression.Lambda<Func<Product, object>>(converted, param);
                if (lambda is not null)
                {
                    if (order.IsASC)
                        query = query.OrderBy(lambda).AsQueryable();
                    else
                        query = query.OrderByDescending(lambda).AsQueryable();

                }
            }
            return query;
        }

        public IQueryable<Product> GetQuerySearch(List<SearchFilter> filters)
        {
            IQueryable<Product> query = _productRepository.Query();
            if (filters is not null && filters.Count > 0)
            {
                foreach (var filter in filters)
                {
                    var value = filter.Value.ToLower().Trim();
                    switch (filter.FieldName.ToLower().Trim())
                    {
                        case "name":
                            query = query.Where(u => u.Name.Contains(value));
                            break;
                        case "price":
                            query = query.Where(u => u.Price.Equals(Double.Parse(value)));
                            break;
                        default:
                            break;
                    }
                }
            }
            return query;
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
