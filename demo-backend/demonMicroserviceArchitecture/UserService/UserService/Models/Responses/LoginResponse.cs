namespace UserService.Models.Responses
{
    public class LoginResponse
    {
        public string Name { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
