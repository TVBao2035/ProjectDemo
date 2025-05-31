using System.Linq.Expressions;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using OrderService.Common;
using OrderService.Models.DTOs;
using OrderService.Models.Enities;
using OrderService.Repositories.Implements;
using OrderService.Repositories.Interfaces;
using OrderService.Services.Interfaces;
using UserService.Models.DTOs;
using UserService.Models.Requests;
using UserService.Models.Responses;

namespace OrderService.Services.Implements
{
    public class OrderServices : IOrderService
    {
        private IOrderRepository _orderRepository;
        private IConfiguration _config;
        private IHttpContextAccessor _httpContext;
        private IOrderDetailRepository _orderDetailRepository;

        public OrderServices(
            IOrderRepository orderRepository, 
            IOrderDetailRepository orderDetailRepository,
            IConfiguration config,
            IHttpContextAccessor httpContext
            ) 
        {
            _orderRepository = orderRepository;
            _config = config;
            _httpContext = httpContext;
            _orderDetailRepository = orderDetailRepository;
        }
        public async Task<AppReponse<SearchResponse<OrderResponse>>> Search(SearchRequest request)
        {
            var result = new AppReponse<SearchResponse<OrderResponse>>();
            try
            {
                SearchResponse<OrderResponse> reponse = new SearchResponse<OrderResponse>();
                //reponse.SearchData = new List<OrderDetailModal>();
                //var query = GetQuerySearch(request.Filters);

                //query = GetQuerySort(request.Sort, query);

                //int pageSize = request.PageSize;
                //int currPage = request.PageIndex - 1;
                //int skip = pageSize * currPage;
                //int totalPage = (query.Count() / request.PageSize);
                //if ((query.Count() % request.PageSize != 0)) totalPage++;

                //query = query.Skip(skip).Take(pageSize);
                //var orders = query.Select(ord => new OrderDetailModal
                //{
                //    Id = ord.Id,
                //    User = ord.User,
                //    Product = ord.Product

                //}).ToList();


                //if (currPage > totalPage) currPage = totalPage;
                //reponse.SearchData = orders;
                //reponse.PageIndex = currPage + 1;
                //reponse.TotalPages = totalPage;


                return result.SendReponse(200, "Success", reponse);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public IQueryable<Order> GetQuerySort(SortOrder order, IQueryable<Order> query)
        {
            if (order is not null)
            {
                var param = Expression.Parameter(typeof(Order), "m");
                var property = Expression.Property(param, order.FieldName);
                var converted = Expression.Convert(property, typeof(object));
                var lambda = Expression.Lambda<Func<Order, object>>(converted, param);
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

        public IQueryable<Order> GetQuerySearch(List<SearchFilter> filters)
        {
            IQueryable<Order> query = _orderRepository.Query();
            //if (filters is not null && filters.Count > 0)
            //{
            //    foreach (var filter in filters)
            //    {
            //        var value = filter.Value.ToLower().Trim();
            //        switch (filter.FieldName.ToLower().Trim())
            //        {
            //            case "productid":
            //                if(value.Length != 0)
            //                {
            //                    query = query.Where(u => u.ProductId.Equals(Guid.Parse(value)));
            //                }
            //                break;
            //            case "username":
            //                query = query.Where(u => u.User.Name.Contains(value));
            //                break;
            //            case "email":
            //                query = query.Where(u => u.User.Email.Equals(value));
            //                break;
            //            case "price":
            //                query = query.Where(u => u.Product.Price.Equals(Double.Parse(value)));
            //                break;
            //            case "productname":
            //                query = query.Where(u => u.Product.Name.Contains(value));
            //                break;
            //            default:
            //                break;
            //        }
            //    }
            //}
            return query;
        }


        public async Task<AppReponse<OrderResponse>> Create(OrderCreateRequest request)
        {
            var result = new AppReponse<OrderResponse>();
            try
            {
                string httpUserString = $"{_config["Microservices:UserService"]}/{request.UserId}";
                AppHttpClient<AppReponse<User>> userHttp = new AppHttpClient<AppReponse<User>>();
                var user = await userHttp.GetDataFromHttp(httpUserString);
                if (user.StatusCode != 200)
                    return result.SendReponse(user.StatusCode, user.Message);

                Order order = new Order
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId
                };
             
                await _orderRepository.AddAsync(order);
                string httpProductString;
                AppHttpClient<AppReponse<Product>> productHttp = new AppHttpClient<AppReponse<Product>>();
                OrderDetail orderDetail;
                int priceTotal = 0;
                foreach (var prod in request.Products)
                {
                    httpProductString = $"{_config["Microservices:ProductService"]}/{prod.Id}";
                    var product = await productHttp.GetDataFromHttp(httpProductString);
                    if (product.StatusCode != 200)
                        return result.SendReponse(product.StatusCode, product.Message);
                    priceTotal += prod.Price;
                    orderDetail = new OrderDetail
                    {
                        Id = Guid.NewGuid(),
                        ProductId = prod.Id,
                        OrderId = order.Id
                    };
                    await _orderDetailRepository.AddAsync(orderDetail);

                }
                order.TotalPrice = priceTotal;
                _orderRepository.Update(order);
                var orderDto = new OrderResponse
                {
                    Id = order.Id,
                    TotalPrice = order.TotalPrice,
                    Date = order.Date,
                    User = user.Data
                };
                return result.SendReponse(200, "Success", orderDto);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<OrderResponse>> Delete(Guid Id)
        {
            var result = new AppReponse<OrderResponse>();
            try
            {
                var order = _orderRepository.Query(ord => ord.Id == Id).FirstOrDefault();

                if (order is null) return result.SendReponse(404, "Not found order");

                var orderDetails = _orderDetailRepository.Query(ord => ord.OrderId == order.Id).ToList();

                _orderDetailRepository.Delete(orderDetails);
                _orderRepository.Delete(order);

                return result.SendReponse(200, "Success");
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }



        public async Task<AppReponse<List<OrderResponse>>> GetAll()
        {
            var result = new AppReponse<List<OrderResponse>>();
            try
            {
                string httpUserString = string.Empty;
                var listOrder = await _orderRepository.Query().ToListAsync();
                List<OrderResponse> orderResponses = new List<OrderResponse>();
                AppHttpClient<AppReponse<User>> userHttp = new AppHttpClient<AppReponse<User>>();
                foreach (var order in listOrder)
                {
                    httpUserString = $"{_config["Microservices:UserService"]}/{order.UserId}";
                   
                    var user = await userHttp.GetDataFromHttp(httpUserString);
                    if (user.StatusCode != 200)
                        return result.SendReponse(user.StatusCode, user.Message);

                   
                    orderResponses.Add(new OrderResponse
                    {
                        Id = order.Id,
                        User = user.Data,
                        TotalPrice = order.TotalPrice,
                        Date = order.Date
                    });
                }

                return result.SendReponse(200, "Success", orderResponses);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<OrderResponse>> Update(OrderUpdateRequest request)
        {
            var result = new AppReponse<OrderResponse>();
            try
            {
               // var order = _orderRepository.Query(ord => ord.Id == request.Id).FirstOrDefault();
                //if (order is null) return result.SendReponse(404, "Not found order");

                //string httpUserString = $"{_config["Microservices:UserService"]}/{request.UserId}";
                //string httpProductString = $"{_config["Microservices:ProductService"]}/{request.ProductId}";

                //AppHttpClient<AppReponse<User>> userHttp = new AppHttpClient<AppReponse<User>>();
                //var user = await userHttp.GetDataFromHttp(httpUserString);
                //if (user.StatusCode != 200)
                //    return result.SendReponse(user.StatusCode, user.Message);

                //AppHttpClient<AppReponse<Product>> productHttp = new AppHttpClient<AppReponse<Product>>();
                //var product = await productHttp.GetDataFromHttp(httpProductString);
                //if (product.StatusCode != 200)
                //    return result.SendReponse(product.StatusCode, product.Message);
                //order.UserId = request.UserId;
                //order.ProductId=request.ProductId;

                //_orderRepository.Update(order);

            
                return result.SendReponse(200, "Success");
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
    }
}
