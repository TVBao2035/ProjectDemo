using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrderService.Models.Enities
{
    [Table("OrderDetail")]
    public class OrderDetail
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }
        public User? Order { get; set; }
        [Required]
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }

        public Product? Product { get; set; }
    }
}
