export const Tokens = {
  Admin: {
    Repository: Symbol('AdminRepository'),
    Service: Symbol('AdminService'),
  },
  Addresses: {
    Repository: Symbol('AddressesRepository'),
    Service: Symbol('AddressesService'),
  },
  Auth: {
    Service: Symbol('AuthService'),
  },
  Categories: {
    Repository: Symbol('CategoriesRepository'),
    Service: Symbol('CategoriesService'),
  },
  Orders: {
    Repository: Symbol('OrdersRepository'),
    Service: Symbol('OrdersService'),
  },
  Product: {
    Repository: Symbol('ProductRepository'),
    Service: Symbol('ProductService'),
  },
};
