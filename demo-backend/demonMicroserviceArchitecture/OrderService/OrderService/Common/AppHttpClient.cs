using Azure.Core;
using System.Net.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OrderService.Models.Enities;
using OrderService.Models;
using System.Net.Http.Headers;
namespace OrderService.Common
{
    public class AppHttpClient<T>
    {

        private static HttpClient httpClient = new HttpClient();
        public async Task<T> GetDataFromHttp(string url)
        {
            var token = AppGetToken.GetToken();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var http = await httpClient.GetAsync(url);
            var json = await http.Content.ReadAsStringAsync();
            T data = JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return data;

        }
    }
}
