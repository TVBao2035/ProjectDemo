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
        public User? User { get; set; }
        public int TotalPrice { get; set; } = 0;
        public string Date { get; set; } = DateTime.Today.ToString("dd/MM/yyyy");
    }
}
