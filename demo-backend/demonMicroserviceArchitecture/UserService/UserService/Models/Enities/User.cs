using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models.Enities
{
    [Table("User")]
    public class User
    {
        [Key]
        public Guid Id {  get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }

        public string Password { get; set; }
    }
}
