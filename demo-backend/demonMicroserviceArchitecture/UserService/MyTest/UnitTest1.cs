using System.Linq.Expressions;
using Azure.Core;
using Moq;
using MockQueryable.Moq; 
using UserService.Models.DTOs;
using UserService.Models.Enities;
using UserService.Repositories.Interfaces;
using UserService.Services.Implements;
using UserService.Services.Interfaces;
using MockQueryable;
using System.Data.Entity;
using UserService.Models.Requests;
using Microsoft.Extensions.Configuration;

using NUnit;
using Microsoft.AspNetCore.Identity.Data;

namespace MyTest
{
    public class UserService_Test
    {
        private Mock<IUserRepository> _mockUserRepo;
        private Mock<ITokenRepository> _mockTokenRepo;
        private Mock<IConfiguration> _mockConfig;
        private UserServices _userService;
        private List<User> users = new List<User>
            {
                new User
                {
                     Id = Guid.NewGuid(),
                    Name = "baobao",
                    Email = "baobao@gmail.com",
                    Password = "12345"
                },
                new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice",
                    Email = "aliceadffasffasfd@email.com",
                    Password = "12345"
                },
                new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice1",
                    Email = "alice1afdsfasds@email.com",
                    Password = "12345"
                },
                new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice2",
                    Email = "alicefasdfsf2@email.com",
                    Password = "12345"
                },  new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice",
                    Email = "alice@email.com",
                    Password = "12345"
                },
                new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice1",
                    Email = "alice1@email.com",
                    Password = "12345"
                },
                new User {
                    Id =  Guid.NewGuid(),
                    Name = "Alice2",
                    Email = "alice2@email.com",
                    Password = "12345"
                }
            };
        [SetUp]
        public void Setup()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _mockTokenRepo = new Mock<ITokenRepository>();
            _mockConfig = new Mock<IConfiguration>();

            _mockConfig.Setup(config => config["Auth:Key"]).Returns("c906743b-161a-42b3-a8d0-b18cb0e0ae5f");
            _mockConfig.Setup(config => config["Auth:Issuer"]).Returns("http://localhost:5190");
            _mockConfig.Setup(config => config["Auth:Audience"]).Returns("gateway_api");
            _mockConfig.Setup(config => config["Auth:ExpiredAccessToken"]).Returns("10800");
            _mockConfig.Setup(config => config["Auth:ExpiredRefreshToken"]).Returns("30600");

            var mockUserQueryable = users.BuildMock();
            _mockUserRepo
                .Setup(r => r.GetQueryable(It.IsAny<Expression<Func<User, bool>>>()))
                .Returns(
                   (Expression<Func<User, bool>> predicate) => mockUserQueryable.Where(predicate)
                );


            _mockTokenRepo.Setup(r => r.Insert(It.IsAny<Token>()));
            _mockTokenRepo.Setup(r => r.Insert(It.IsAny<Token>())); 
            _mockUserRepo.Setup(r => r.Delete(It.IsAny<User>()));
            _mockUserRepo.Setup(r => r.Insert(It.IsAny<User>()));
            _mockUserRepo.Setup(r => r.Update(It.IsAny<User>()));

            _mockUserRepo.Setup(r => r.GetQueryable()).Returns(mockUserQueryable.AsQueryable());
            _userService = new UserServices(
                _mockUserRepo.Object,
                _mockConfig.Object,
                _mockTokenRepo.Object
            );
        }

        [Test]
        public async Task Update_Returns_Success()
        {
            var fakeData = new User
            {
                Name = "tvbao",
                Email = "tvbao@gmail.com",
                Password = "12345",
                Id = Guid.NewGuid(),
            };

            users.Add(fakeData);

            fakeData.Name = "baobao";
            fakeData.Email = "TVBaooo@gmail.com";
            var data = await _userService.Update(fakeData);

            Assert.IsNotNull(data.Data);
            Assert.AreEqual("Success", data.Message);
            Assert.AreEqual(200, data.StatusCode);
            Assert.AreEqual(fakeData.Name, data.Data.Name);
            Assert.AreEqual(fakeData.Email, data.Data.Email);
        }

        [Test]
        public async Task Update_User_Is_Not_Existing_Returns_Failed()
        {
            var fakeData = new User
            {
                Name = "tvbao",
                Email = "baobao@gmail.com",
                Password = "12345",
                Id = Guid.NewGuid(),
            };

            var data = await _userService.Update(fakeData);

            Assert.IsNull(data.Data);
            Assert.AreEqual("Not found user", data.Message);
            Assert.AreEqual(404, data.StatusCode);
        }


        [Test]
        public async Task Update_Email_Is_Existing_Returns_Failed()
        {
            var fakeData = new User
            {
                Name = "tvbao",
                Email = "tvbao@gmail.com",
                Password = "12345",
                Id = Guid.NewGuid(),
            };
            users.Add(fakeData);
            fakeData.Email = "baobao@gmail.com";
            var data = await _userService.Update(fakeData);

            Assert.IsNull(data.Data);
            Assert.AreEqual("Email is existing", data.Message);
            Assert.AreEqual(404, data.StatusCode);
        }
        [Test]
        public async Task Delete_Returns_Success()
        {
            var fakeData = new User
            {
                Name = "tvbao",
                Email = "tvbao@gmail.com",
                Password = "12345",
                Id = Guid.NewGuid(),
            };

            users.Add(fakeData);

            var data = await _userService.Delete(fakeData.Id);

            Assert.IsNotNull(data.Data);
            Assert.AreEqual(200, data.StatusCode);
            Assert.AreEqual("Success", data.Message);
            Assert.AreEqual(fakeData.Name, data.Data.Name);
            Assert.AreEqual(fakeData.Email, data.Data.Email);

        }


        [Test]
        public async Task Delete_With_User_Is_Not_Existing_Returns_Failed()
        {
            var fakeData = new User
            {
                Name = "tvbao",
                Email = "tvbao@gmail.com",
                Password = "12345",
                Id = Guid.NewGuid(),
            };

            var data = await _userService.Delete(fakeData.Id);

            Assert.IsNull(data.Data);
            Assert.AreEqual(404, data.StatusCode);
            Assert.AreEqual("Not Found User", data.Message);

        }

        [Test]
        public async Task Login_With_Wrong_Password_ReturnsFailed()
        {
            var fakeData = new User
            {
                Id = Guid.NewGuid(),
                Name = "baobao",
                Email = "baobao@email.com",
                Password = "123422"
            };



            SignInRequest loginForm = new SignInRequest
            {
                Email = fakeData.Email,
                Password = fakeData.Password
            };

            var result = await _userService.Login(loginForm);


            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Email or Pasword is wrong", result.Message, "Message should be 'Email or Pasword is wrong'");
            Assert.IsNull(result.Data, "LoginResponse data should null");

        }

        [Test]
        public async Task Login_With_Wrong_Emai_ReturnsFailed()
        {
            var fakeData = new User
            {
                Id = Guid.NewGuid(),
                Name = "baobao",
                Email = "baobao1@email.com",
                Password = "12345"
            };
           
            SignInRequest loginForm = new SignInRequest
            {
                Email = fakeData.Email,
                Password = fakeData.Password
            };

            var result = await _userService.Login(loginForm);


            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Email or Pasword is wrong", result.Message, "Message should be 'Email or Pasword is wrong'");
            Assert.IsNull(result.Data, "LoginResponse data should null");
            
        }

        [Test]
        public async Task Login_ReturnsSuccess()
        {
            var fakeData = new User
            {
                Id = Guid.NewGuid(),
                Name = "baobao",
                Email = "baobao@gmail.com",
                Password = "12345"
            };
           

            SignInRequest loginForm = new SignInRequest
            {
                Email = fakeData.Email,
                Password = fakeData.Password
            };
          
            var result = await _userService.Login(loginForm);


            Assert.IsNotNull(result, "Response should not be null");
            Assert.AreEqual(200, result.StatusCode, "Status code should be 200");
            Assert.AreEqual("Success", result.Message, "Message should be 'Success'");
            Assert.IsNotNull(result.Data, "LoginResponse data should not be null");
            Assert.AreEqual(fakeData.Name, result.Data.Name, "User name should match");
            Assert.IsNotEmpty(result.Data.AccessToken, "Access token should not be empty");
            Assert.IsNotEmpty(result.Data.RefreshToken, "Refresh token should not be empty");
        }

        [Test]
        public async Task LoginWithManyRequests_ReturnsSuccess()
        {
            var fakeData = new User
            {
                Id = Guid.NewGuid(),
                Name = "baobao",
                Email = "baobao@gmail.com",
                Password = "12345"
            };
            

            SignInRequest loginForm = new SignInRequest
            {
                Email = fakeData.Email,
                Password = fakeData.Password
            };

            var tasks = Enumerable.Range(0, 1000)
            .Select(_ => _userService.Login(loginForm))
            .ToArray();
            var results = await Task.WhenAll(tasks);
            foreach (var result in results)
            {
                Assert.AreEqual(200, result.StatusCode);
                Assert.AreEqual("Success", result.Message);
                Assert.IsNotNull(result.Data);
                Assert.AreEqual(fakeData.Name, result.Data.Name);
            }

        }
  
        [Test]
        public async Task CreateUser_ReturnsSuccess()
        {
            var fakeData = new UserDTO
            {
                Email = "baovantruong@gmail.com",
                Name = "jlfajsfl"
            };

            var data = await _userService.Create(fakeData);

            Assert.AreEqual(200, data.StatusCode);
            Assert.AreEqual(fakeData.Name, data.Data.Name);
            Assert.AreEqual(fakeData.Email, data.Data.Email);
        }

        [Test]
        public async Task CreateUser_With_Email_Is_Existing_ReturnsFailed()
        {
            var fakeData = new UserDTO
            {
                Email = "baobao@gmail.com",
                Name = "jlfajsfl"
            };

            var data = await _userService.Create(fakeData);

            Assert.AreEqual(404, data.StatusCode);
            Assert.IsNull(data.Data);
            Assert.AreEqual("Email is exisiting", data.Message);
        }
        [Test]
        public async Task GetAllUser_ReturnsSuccess() {
         
            var mockUserQueryable = users.BuildMock();


            var result = await _userService.GetAll();

            Assert.IsNotNull(result.Data);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetById_UserExists_ReturnsSuccess()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var fakeUser = new User { Id = userId, Name = "Alice", Email = "alice@email.com", Password="12345" };
            users.Add(fakeUser);
            // Act
            var result = await _userService.GetById(userId);

            // Assert
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsNotNull(result.Data);
            Assert.AreEqual(fakeUser.Name, result.Data.Name);
            Assert.AreEqual(fakeUser.Email, result.Data.Email);
        }

        [Test]
        public async Task GetById_UserExists_ReturnsFailed()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var fakeUser = new User { Id = userId, Name = "Alice", Email = "alice@email.com", Password = "12345" };
         

            var mockUserQueryable = users.BuildMock(); // Tạo mock hỗ trợ async

            _mockUserRepo.Setup(r => r.GetQueryable(It.IsAny<Expression<Func<User, bool>>>()))
                .Returns(
                    (Expression<Func<User, bool>> predicate) => mockUserQueryable.Where(predicate)
                   );

            // Act
            var result = await _userService.GetById(userId);

            // Assert
            Assert.AreEqual(404, result.StatusCode);
            Assert.IsNull(result.Data);
            Assert.AreEqual("Not found user", result.Message);
        }
    }
}