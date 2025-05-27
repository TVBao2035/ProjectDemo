using UserService.Models.DTOs;
using UserService.Models.Enities;
using UserService.Models.Requests;
using UserService.Models.Responses;

namespace UserService.Services.Interfaces
{
    public interface IUserService
    {
        Task<AppReponse<UserDTO>> Create(UserDTO request);
        Task<AppReponse<UserDTO>> Update(User request);
        Task<AppReponse<UserDTO>> Delete(Guid Id);
        Task<AppReponse<List<UserDTO>>> GetAll();
        Task<AppReponse<UserDTO>> GetById(Guid Id);
        Task<AppReponse<SearchResponse<UserDTO>>> Search(SearchRequest request);
        Task<AppReponse<LoginResponse>> Login(SignInRequest request);
        Task<AppReponse<LoginResponse>> Refresh(string refreshToken);
    }
}
