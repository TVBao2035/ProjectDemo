    using UserService.Models.DTOs;

namespace UserService.Models.Requests
{
    public class SearchRequest
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 5;

        public List<SearchFilter>? Filters { get; set; }

        public SortOrder? Sort { get; set; }
    }
}
