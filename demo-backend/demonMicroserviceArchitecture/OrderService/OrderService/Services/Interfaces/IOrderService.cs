using OrderService.Models.Enities;
using OrderService.Models.DTOs;

namespace OrderService.Services.Interfaces
{
    public interface IOrderService
    {
        Task<AppReponse<OrderDTO>> Create(OrderDTO request);
        Task<AppReponse<OrderDTO>> Update(Order request);
        Task<AppReponse<OrderDTO>> Delete(Guid Id);
        Task<AppReponse<List<OrderDTO>>> GetAll();
    }
}
