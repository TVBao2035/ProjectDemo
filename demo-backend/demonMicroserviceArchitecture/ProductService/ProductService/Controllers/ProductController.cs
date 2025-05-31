using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductService.Models.DTOs;
using ProductService.Models.Enities;
using ProductService.Services.Implements;
using ProductService.Services.Interfaces;
using UserService.Models.Requests;

namespace ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private IProductService _productService;

        public ProductController(IProductService productService) {
            _productService = productService;

        }

        [HttpPost]
        [Route("Search")]
        public async Task<IActionResult> Search([FromBody] SearchRequest searchRequest)
        {
            var data = await _productService.Search(searchRequest);
            return Ok(data);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(Guid Id)
        {
            var data = await _productService.Delete(Id);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _productService.GetAll();
            return Ok(data);
        }
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetById(Guid Id)
        {
            var data = await _productService.GetById(Id);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductDTO request)
        {
            var data = await _productService.Create(request);
            return Ok(data);
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Product request)
        {
            var data = await _productService.Update(request);
            return Ok(data);
        }
    }
}
