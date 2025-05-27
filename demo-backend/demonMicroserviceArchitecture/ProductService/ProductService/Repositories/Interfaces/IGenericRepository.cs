using System.Linq.Expressions;

namespace OrderService.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
        IQueryable<T> Query(Expression<Func<T, bool>> expression);
        IQueryable<T> Query();
    }
}
