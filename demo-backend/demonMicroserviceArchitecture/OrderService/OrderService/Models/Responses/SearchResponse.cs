namespace UserService.Models.Responses
{
    public class SearchResponse<T>
    {
        public int  TotalPages { get; set; }
        public int CurrPage { get; set; }

        public List<T> Results { get; set; }
    }
}
