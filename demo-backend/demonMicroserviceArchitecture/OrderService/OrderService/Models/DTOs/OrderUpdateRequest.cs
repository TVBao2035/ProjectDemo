using OrderService.Models.Enities;

namespace OrderService.Models.DTOs
{
    public class OrderUpdateRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public List<Product>? Products { get; set; }
    }
}
