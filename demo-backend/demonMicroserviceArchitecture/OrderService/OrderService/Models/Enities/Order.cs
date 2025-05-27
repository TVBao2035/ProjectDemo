using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrderService.Models.Enities
{
    [Table("Order")]
    public class Order
    {
        [Key]
        public Guid Id  { get; set; }
        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        [Required]
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
    }
}
