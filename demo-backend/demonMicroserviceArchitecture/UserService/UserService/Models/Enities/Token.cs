using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models.Enities
{
    [Table("Token")]
    public class Token
    {
        [Key]
        public Guid Code { get; set; }
        public string RefreshToke { get; set; } = string.Empty;
        public string  AccessToken { get; set; } = string.Empty;

        public DateTime Expire { get; set;  }
    }
}
