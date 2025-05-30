using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using OrderService.Common;
using OrderService.Models.DTOs;
using OrderService.Models.Enities;
using OrderService.Repositories.Interfaces;
using OrderService.Services.Interfaces;

namespace OrderService.Services.Implements
{
    public class OrderServices : IOrderServices
    {
        private IOrderRepository _orderRepository;
        private IConfiguration _config;
        private IHttpContextAccessor _httpContext;

        public OrderServices(
            IOrderRepository orderRepository, 
            IConfiguration config,
            IHttpContextAccessor httpContext
            ) 
        {
            _orderRepository = orderRepository;
            _config = config;
            _httpContext = httpContext;
        }

        

        public async Task<AppReponse<OrderResponse>> Create(OrderCreateRequest request)
        {
            var result = new AppReponse<OrderResponse>();
            try
            {
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


                //Order order = new Order();
                //order.Id = Guid.NewGuid();
                //order.UserId = request.UserId;
                //order.ProductId = request.ProductId;
                //_orderRepository.Add(order);

                return result.SendReponse(200, "Success");
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
                   




                return result.SendReponse(200, "Success   ldkadfsafjskfls");     
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
                //string httpUserString;
                //string httpProductString;
                //var listOrder = await _orderRepository.Query()
                //    .Select(or => new OrderResponse
                //    {
                //        UserId = or.UserId,
                //        ProductId = or.ProductId,
                //    }).ToListAsync();

                //AppHttpClient<AppReponse<User>> userHttp = new AppHttpClient<AppReponse<User>>();
                //AppHttpClient<AppReponse<Product>> productHttp = new AppHttpClient<AppReponse<Product>>();

                //foreach(var order in listOrder)
                //{
                //    httpUserString = $"{_config["Microservices:UserService"]}/{order.UserId}";
                //    httpProductString = $"{_config["Microservices:ProductService"]}/{order.ProductId}";

                //    var user = await userHttp.GetDataFromHttp(httpUserString);
                //    if (user.StatusCode != 200)
                //        return result.SendReponse(user.StatusCode, user.Message);

                //    var product = await productHttp.GetDataFromHttp(httpProductString);
                //    if (product.StatusCode != 200)
                //        return result.SendReponse(product.StatusCode, product.Message);
                //    order.User = user.Data;
                //    order.Product = product.Data;
                //}

                return result.SendReponse(200, "Success");
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
                return result.SendReponse(200, "Success");
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
    }
}
