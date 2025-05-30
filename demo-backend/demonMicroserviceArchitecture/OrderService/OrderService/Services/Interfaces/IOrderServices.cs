using OrderService.Models.DTOs;

namespace OrderService.Services.Interfaces
{
    public interface IOrderServices
    {
        Task<AppReponse<OrderResponse>> Create(OrderCreateRequest request);
        Task<AppReponse<OrderResponse>> Delete(Guid Id);
        Task<AppReponse<List<OrderResponse>>> GetAll();
        Task<AppReponse<OrderResponse>> Update(OrderUpdateRequest request);
    }
}
