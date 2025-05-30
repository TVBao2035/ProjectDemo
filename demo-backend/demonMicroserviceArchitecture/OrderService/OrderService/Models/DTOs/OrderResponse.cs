using OrderService.Models.Enities;

namespace OrderService.Models.DTOs
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public User? User { get; set; }
        public int TotalPrice { get; set; } = 0;
        public string Date { get; set; } = DateTime.Today.ToString("dd/MM/yyyy");
    }
}
