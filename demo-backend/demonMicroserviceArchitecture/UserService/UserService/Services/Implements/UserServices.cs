using System.Collections.Generic;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using Azure.Core;
using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using UserService.Models.DTOs;
using UserService.Models.Enities;
using UserService.Models.Requests;
using UserService.Models.Responses;
using UserService.Repositories.Implements;
using UserService.Repositories.Interfaces;
using UserService.Services.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace UserService.Services.Implements
{
    public class UserServices : IUserService
    {
        private IUserRepository _userRepository;
        private ITokenRepository _tokenRepository;
        private IConfiguration _config;

        public UserServices(
            IUserRepository userRepository, 
            IConfiguration config,
            ITokenRepository tokenRepository
        ) {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _config = config;
        }
     
        public async Task<AppReponse<SearchResponse<UserDTO>>> Search(SearchRequest request) 
        {
           var result = new  AppReponse<SearchResponse<UserDTO>>();
            try
            {
                SearchResponse<UserDTO> reponse = new SearchResponse<UserDTO>();
                reponse.Results = new List<UserDTO>();
                var query = GetQuerySearch(request.Filters);

                query = GetQuerySort(request.Sort, query);
        
                int pageSize = request.PageSize;
                int currPage = request.CurrPage - 1;
                int skip = pageSize * currPage;
                int totalPage = (query.Count() / request.PageSize);
                if ((query.Count() % request.PageSize != 0)) totalPage++;

                query = query.Skip(skip).Take(pageSize);
                var users = query.Select(u => new UserDTO
                {
                    Name = u.Name,
                    Email = u.Email
                }).ToList();


                if (currPage > totalPage) currPage = totalPage;
                reponse.Results = users;
                reponse.CurrPage = currPage + 1;
                reponse.TotalPages = totalPage;


                return result.SendReponse(200, "Success", reponse);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public IQueryable<User> GetQuerySort(SortOrder order, IQueryable<User> query)
        {
            if (order is not null)
            {
                var param = Expression.Parameter(typeof(User), "m");
                var property = Expression.Property(param, order.FieldName);
                var lambda = Expression.Lambda<Func<User, object>>(property, param);
                if(lambda is not null)
                {
                    if (order.IsASC )
                        query = query.OrderBy(lambda ).AsQueryable();
                    else
                        query = query.OrderByDescending(lambda).AsQueryable();

                }
            }
            return query;
        }

        public IQueryable<User> GetQuerySearch(List<SearchFilter> filters)
        {
            IQueryable<User> query = _userRepository.GetQueryable();
            if (filters is not null && filters.Count > 0)
            {
                foreach(var filter in filters)
                {
                    var value = filter.Value.ToLower().Trim();
                    switch (filter.FieldName.ToLower().Trim())
                    {
                        case "name":
                            query = query.Where(u => u.Name.Contains(value));
                            break;
                        case "email":
                            query = query.Where(u => u.Email.Equals(value));
                            break;
                        default:
                            break;
                    }
                }
            }
            return query;
        }


        public async Task<AppReponse<LoginResponse>> Login(SignInRequest request)
        {
            var response = new AppReponse<LoginResponse>();
            try
            {
                var user = await _userRepository
                    .GetQueryable(u => u.Email == request.Email)
                    .FirstOrDefaultAsync();
                if (user is null || !user.Password.Equals(request.Password)) 
                    return response.SendReponse(404, "Email or Pasword is wrong");
                Token token = new Token();
                token.AccessToken = CreateAccessToken(user);
                (token.RefreshToke, token.Expire, token.Code) = CreateRefreshToken(user);
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.AccessToken = token.AccessToken;
                loginResponse.RefreshToken = token.RefreshToke;
                loginResponse.Name = user.Name;
                _tokenRepository.Insert(token);
                return response.SendReponse(200, "Success", loginResponse);
            }
            catch (Exception ex)
            {
                return response.SendReponse(404, ex.Message);
            }
        }

        public async   Task<AppReponse<LoginResponse>> Refresh(string refreshToken)
        {
            var response = new AppReponse<LoginResponse>();
            try
            {
                var claimPrincial = new JwtSecurityTokenHandler().ValidateToken(
                     refreshToken,
                     new TokenValidationParameters
                     {
                         ValidateIssuer = true,
                         ValidIssuer = _config["Auth:Issuer"],
                         ValidateAudience = true,
                         ValidAudience = _config["Auth:Audience"],
                         ValidateLifetime = true,
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Auth:Key"])),
                         RequireExpirationTime = true,
                         ClockSkew = TimeSpan.Zero
                     },
                     out _
                     );
                
                var claims = claimPrincial.Claims.ToList();
                if (claims.Count == 0) return response.SendReponse(401, "Payload is not valid");

                var codeClaim = claimPrincial.FindFirst(ClaimTypes.SerialNumber);
                if (codeClaim is null)
                    return response.SendReponse(404, "Not found code in token");
                var code = Guid.Parse(codeClaim.Value);
                var emailUserClaim = claimPrincial.FindFirst("Email");
                if (emailUserClaim is null) 
                    return response.SendReponse(404, "Not Found Email In Token");
                var getRefresh =  _tokenRepository
                    .GetQueryable(t => t.Code == code)
                    .FirstOrDefault();
                var user = _userRepository.GetQueryable(u => u.Email== emailUserClaim.Value).FirstOrDefault();

                if (getRefresh is null)
                    return response.SendReponse(404, "Not found");
                
                if(getRefresh.Expire <= DateTime.UtcNow)
                    return response.SendReponse(401, "Refresh Token Was Expired");
                
                if (user is null) 
                    return response.SendReponse(404, "Not found user");


                LoginResponse loginResponse = new LoginResponse();
                Token token = new Token();
                token.AccessToken = CreateAccessToken(user);

                (token.RefreshToke, token.Expire, token.Code) = CreateRefreshToken(user);

                loginResponse.AccessToken = token.AccessToken;
                loginResponse.RefreshToken = token.RefreshToke;
                loginResponse.Name = user.Name;
                _tokenRepository.Insert(token);

                return response.SendReponse(200, "Success", loginResponse);
            }
            catch (Exception ex)
            {
                return response.SendReponse(404, ex.Message);
            }

        }
        private string CreateAccessToken(User user)
        {
            double expiredAccessToken = double.Parse(_config["Auth:ExpiredAccessToken"] ?? "60");
            DateTime expired = DateTime.UtcNow.AddSeconds(expiredAccessToken);
            var claims = GetClaims(user);
            claims.Add(new Claim (JwtRegisteredClaimNames.Exp, expired.ToString()));
            var token =  GenerateToken(claims, expired);
            return token;
        }
        private (string, DateTime, Guid) CreateRefreshToken(User user)
        {
            double expiredRefreshToken = double.Parse(_config["Auth:ExpiredRefreshToken"] ?? "3600");
            DateTime expired = DateTime.UtcNow.AddSeconds(expiredRefreshToken);
            Guid code = Guid.NewGuid();
            var claims = GetClaims(user);
            claims.Add(new Claim(JwtRegisteredClaimNames.Exp, expired.ToString()));
            claims.Add(new Claim(ClaimTypes.SerialNumber, code.ToString()));
            var token = GenerateToken(claims, expired);
            return (token, expired, code);
        }

        private List<Claim> GetClaims(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim("Name", user.Name),
                new Claim("Email", user.Email)
            };
            return claims;
        }
        private string GenerateToken(List<Claim> claims, DateTime time)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Auth:Key"]));
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenInfor = new JwtSecurityToken(
                issuer: _config["Auth:Issuer"],
                audience: _config["Auth:Audience"],
                claims,
                expires: time,
                notBefore: DateTime.UtcNow,
                signingCredentials: credential
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenInfor);
        }


        public async Task<AppReponse<UserDTO>> GetById(Guid Id)
        {
            // dto
            var result = new AppReponse<UserDTO>();
            try
            {
                var user = await _userRepository.GetQueryable(u => u.Id == Id).FirstOrDefaultAsync();
                if(user == null)
                {
                    //
                    return result.SendReponse(404, "Not found user");
                }
                var userDTO = new UserDTO
                {
                    Name = user.Name,
                    Email = user.Email
                };
                return result.SendReponse(200, "Success", userDTO);
            }catch(Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
        public async Task<AppReponse<UserDTO>> Create(UserDTO request)
        {
            var result = new AppReponse<UserDTO>();
            try
            {
                var user = _userRepository
                    .GetQueryable(u => u.Email.Equals(request.Email))
                    .FirstOrDefault();
                if ( user is not null)
                {
                    return result.SendReponse(404, "Email is exisiting");
                }
                user = new User();
                user.Id = Guid.NewGuid();
                user.Email = request.Email;
                user.Password = "12345";
                user.Name = request.Name;
                 _userRepository.Insert(user);
                return result.SendReponse(200, "Success", request);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async  Task<AppReponse<UserDTO>> Delete(Guid Id)
        {
            var result = new AppReponse<UserDTO>();
            try
            {
                var user = await _userRepository
                    .GetQueryable(u => u.Id == Id)
                    .FirstOrDefaultAsync();
                if (user is  null)
                {
                    return result.SendReponse(404, "Not Found User");
                }
                _userRepository.Delete(user);
                var userDTO = new UserDTO
                {
                    Email = user.Email,
                    Name = user.Name,
                };
                return result.SendReponse(200, "Success", userDTO);

            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async  Task<AppReponse<List<UserDTO>>> GetAll()
        {
            var result = new AppReponse<List<UserDTO>>();
            try
            {
                List<UserDTO> listUser = await _userRepository.GetQueryable()
                    .Select(u => new UserDTO
                    {
                        Name = u.Name,
                        Email = u.Email
                    })
                    .ToListAsync();
                return result.SendReponse(200, "Success", listUser);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }

        public async Task<AppReponse<UserDTO>> Update(User request)
        {
            var result = new AppReponse<UserDTO>();
            try
            {
                var user = await _userRepository.GetQueryable(u => u.Id == request.Id).FirstOrDefaultAsync();
                if (user is null) 
                    return result.SendReponse(404, "Not found user");

                var test = await _userRepository
                    .GetQueryable(u => u.Email == request.Email)
                    .FirstOrDefaultAsync();

                if(test is not null && test.Id != user.Id)
                {
                    return result.SendReponse(404, "Email is existing");
                }
                user.Email = request.Email;
                user.Name = request.Name;
                _userRepository.Update(user);
                var userDTO = new UserDTO
                {
                    Email = request.Email,
                    Name = request.Name,
                };
                return result.SendReponse(200, "Success", userDTO);
            }
            catch (Exception ex)
            {
                return result.SendReponse(404, ex.Message);
            }
        }
    }
}
