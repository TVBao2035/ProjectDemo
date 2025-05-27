using System.ComponentModel.DataAnnotations;

namespace ProductService.Models.DTOs
{
    public class ProductDTO
    {
        public string Name { get; set; }
        public double Price { get; set; }
    }
}
