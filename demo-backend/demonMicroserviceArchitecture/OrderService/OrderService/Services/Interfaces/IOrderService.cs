using OrderService.Models.Enities;
using OrderService.Models.DTOs;
using UserService.Models.Responses;
using UserService.Models.Requests;

namespace OrderService.Services.Interfaces
{
    public interface IOrderService
    {
        Task<AppReponse<OrderResponse>> Create(OrderCreateRequest request);
        Task<AppReponse<OrderResponse>> Update(OrderUpdateRequest request);
        Task<AppReponse<OrderResponse>> Delete(Guid Id);
        Task<AppReponse<List<OrderResponse>>> GetAll();
        Task<AppReponse<SearchResponse<OrderResponse>>> Search(SearchRequest request);
    }
}
