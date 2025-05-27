using System.Linq.Expressions;
using OrderService.Repositories.Interfaces;
using UserService.Data;

namespace OrderService.Repositories.Implements
{
    public class GenericRepository<T> :IDisposable, IGenericRepository<T> where T : class
    {
        private ApplicationDbContext _context;
        private bool disposedValue;

        public GenericRepository(ApplicationDbContext context) { 
            _context = context;
        
        }
        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
            _context.SaveChanges();
        }

        public void Insert(T entity)
        {
            _context.Set<T>().AddAsync(entity);
            _context.SaveChangesAsync();
        }

        public async Task InsertAsync(T entity)
        {
            await _context.AddAsync(entity);
            await  _context.SaveChangesAsync();
        }

        public IQueryable<T> GetQueryable(Expression<Func<T, bool>> expression)
        {
            return _context.Set<T>().Where(expression).AsQueryable();
        }

        public IQueryable<T> GetQueryable()
        {
            return _context.Set<T>().AsQueryable();
        }
         
        public void Update(T entity)
        {
            _context.Update(entity);
            _context.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects)
                    _context.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~GenericRepository()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        void IDisposable.Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
