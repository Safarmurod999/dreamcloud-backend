import { HttpStatus } from '@nestjs/common';
import { ProductsServiceImpl } from './products.service.impl';
import { ProductsRepository } from '../repository/products.repository';
import { OrdersRepository } from '../../orders/repository/orders.repository';
import { ProductEntity } from '../../entities/products.entity';

// fs ni mocklab qo'yamiz
jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
}));

describe('ProductsServiceImpl', () => {
  let service: ProductsServiceImpl;
  let productRepository: jest.Mocked<ProductsRepository>;
  let ordersRepository: jest.Mocked<OrdersRepository>;

  beforeEach(() => {
    productRepository = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    ordersRepository = {
      findOneBy: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new ProductsServiceImpl(productRepository, ordersRepository);
  });

  it('should return paginated products', async () => {
    const products = [{ id: 1, product_name: 'Test Product' } as ProductEntity];
    productRepository.findAndCount.mockResolvedValue([products, 1]);

    const result = await service.findAll(1, 10);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual(products);
    expect(result.pagination.totalCount).toBe(1);
  });

  it('should set default page and limit if NaN', async () => {
    const products = [{ id: 1, product_name: 'Test Product' } as ProductEntity];
    productRepository.findAndCount.mockResolvedValue([products, 1]);
    const result = await service.findAll(NaN, NaN);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual(products);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  it('should create a new product', async () => {
    const dto: any = { product_name: 'Test', price: 100 };
    const image = 'test.png';

    productRepository.findOneBy.mockResolvedValue(null);
    productRepository.create.mockReturnValue({ ...dto, image });
    productRepository.save.mockResolvedValue({ id: 1, ...dto, image });

    const result = await service.createProduct(dto, image);

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data.product_name).toBe('Test');
  });

  it('should return error if product already exists', async () => {
    const dto: any = { product_name: 'Test' };
    productRepository.findOneBy.mockResolvedValue({
      id: 1,
      product_name: 'Test',
    } as ProductEntity);

    const result = await service.createProduct(dto, 'img.png');

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.message).toBe('Product already exists!');
  });

  it('should update a product', async () => {
    const dto: any = { product_name: 'Updated Product' };
    const product = { id: 1, product_name: 'Old Product' } as ProductEntity;

    productRepository.findOneBy.mockResolvedValue(product);
    productRepository.save.mockResolvedValue({ ...product, ...dto });

    const result = await service.updateProduct({ id: 1 }, dto, 'new.png');

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data.product_name).toBe('Updated Product');
  });

  it('should return not found if product does not exist', async () => {
    productRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateProduct({ id: 99 }, {} as any, null);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Product not found!');
  });

  it('should not delete if there is an order for product', async () => {
    ordersRepository.findOneBy.mockResolvedValue({
      id: 1,
      product_id: 1,
    } as any);

    const result = await service.deleteProduct({ id: 1 });

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.message).toContain('cannot delete this product');
  });

  it('should delete product if no orders exist', async () => {
    ordersRepository.findOneBy.mockResolvedValue(null);
    ordersRepository.delete.mockResolvedValue({} as any);
    productRepository.findOneBy.mockResolvedValue({
      id: 1,
      image: 'img.png',
    } as ProductEntity);
    productRepository.delete.mockResolvedValue({} as any);

    const result = await service.deleteProduct({ id: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('Product deleted successfully');
  });

  it('should return not found if product does not exist', async () => {
    ordersRepository.findOneBy.mockResolvedValue(null);
    productRepository.findOneBy.mockResolvedValue(null);

    const result = await service.deleteProduct({ id: 99 });

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Product not found!');
  });
});
