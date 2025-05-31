namespace ProductService.Models.DTOs
{
    public class ProductDetailModal
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Price { get; set; }
    }
}
