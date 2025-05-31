using UserService.Models.DTOs;
using UserService.Models.Enities;
using UserService.Models.Requests;
using UserService.Models.Responses;

namespace UserService.Services.Interfaces
{
    public interface IUserService
    {
        Task<AppReponse<UserDTO>> Create(UserDTO request);
        Task<AppReponse<UserDTO>> Update(UserDetailModal request);
        Task<AppReponse<UserDTO>> Delete(Guid Id);
        Task<AppReponse<UserDetailModal>> GetById(Guid Id);
        Task<AppReponse<LoginResponse>> Login(SignInRequest request);
        Task<AppReponse<LoginResponse>> Refresh(string refreshToken);
        Task<AppReponse<SearchResponse<UserDetailModal>>> Search(SearchRequest request);
        Task<AppReponse<List<UserDetailModal>>> GetAll();
    }
}
