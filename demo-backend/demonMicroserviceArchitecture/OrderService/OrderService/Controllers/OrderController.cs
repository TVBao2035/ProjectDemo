using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderService.Models.DTOs;
using OrderService.Models.Enities;
using OrderService.Services.Implements;
using OrderService.Services.Interfaces;
using UserService.Models.Requests;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost]
        [Route("Search")]
        public async Task<IActionResult> Search([FromBody] SearchRequest searchRequest)
        {
            var data = await _orderService.Search(searchRequest);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _orderService.GetAll();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateRequest request)
        {
            var data = await _orderService.Create(request);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] OrderUpdateRequest order)
        {
            var data = await _orderService.Update(order);
            return Ok(data);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(Guid Id)
        {
            var data = await _orderService.Delete(Id);
            return Ok(data);
        }
    }
}
