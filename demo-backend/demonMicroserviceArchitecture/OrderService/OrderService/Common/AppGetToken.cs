using OrderService.Models.DTOs;

namespace OrderService.Common
{
    public class AppGetToken
    {
        public static string GetToken()
        {
            IHttpContextAccessor httpContextAccessor = new HttpContextAccessor();
            var headers = httpContextAccessor.HttpContext.Request.Headers;
            if (headers.TryGetValue("Authorization", out var authen))
            {
                var beare = authen.First();
                var token = beare.Split(" ")[1];
                return token;
            }
            return "";
            
        }
    }
}
