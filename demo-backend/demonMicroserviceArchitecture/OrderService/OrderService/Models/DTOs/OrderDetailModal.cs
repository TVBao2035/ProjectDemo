using OrderService.Models.Enities;

namespace OrderService.Models.DTOs
{
    public class OrderDetailModal
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public List<Product>? Products { get; set; }
        public int TotalPrice { get; set; } = 0;
        public string Date { get; set; } = DateTime.Today.ToString("dd/MM/yyyy");
    }
}
