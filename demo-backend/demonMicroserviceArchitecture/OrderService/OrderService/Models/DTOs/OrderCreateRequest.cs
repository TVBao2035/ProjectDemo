using System.ComponentModel.DataAnnotations;
using OrderService.Models.Enities;

namespace OrderService.Models.DTOs
{
    public class OrderCreateRequest
    {
        public Guid UserId { get; set; }
        public List<Product>? Products { get; set; }
    }
}
