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
  Customers: {
    Repository: Symbol('CustomersRepository'),
    Service: Symbol('CustomersService'),
  },
  Technologies: {
    Repository: Symbol('TechnologiesRepository'),
    Service: Symbol('TechnologiesService'),
  }
};
