using UserService.Models.DTOs;

namespace UserService.Models.Requests
{
    public class SearchRequest
    {
        public int PageIndex {  get; set; }
        public int PageSize { get; set; }
        
        public List<SearchFilter>? Filters { get; set; }

        public SortOrder? Sort { get; set; }
    }
}
