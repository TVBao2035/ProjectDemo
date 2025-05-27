using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace ProductService.Models.DTOs
{
    public  class AppReponse<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public AppReponse<T> SendReponse(int StatusCode, string Message, T Data )
        {
            this.StatusCode = StatusCode;
            this.Message = Message;
            this.Data = Data;
            return this;
        }
        public AppReponse<T> SendReponse(int StatusCode, string Message)
        {
            this.StatusCode = StatusCode;
            this.Message = Message;
            return this;
        }
    }
}
