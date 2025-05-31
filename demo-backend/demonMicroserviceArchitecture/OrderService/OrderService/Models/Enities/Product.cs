using System.ComponentModel.DataAnnotations;

namespace OrderService.Models.Enities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
    }
}
