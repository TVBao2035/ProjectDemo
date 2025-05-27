using System.ComponentModel.DataAnnotations;
using OrderService.Models.Enities;

namespace OrderService.Models.DTOs
{
    public class OrderDTO
    {
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
