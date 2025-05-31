namespace UserService.Models.Responses
{
    public class SearchResponse<T>
    {
        public int  TotalPages { get; set; }
        public int PageIndex { get; set; }

        public List<T>? SearchData { get; set; }
    }
}
