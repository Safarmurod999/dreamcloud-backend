import { HttpStatus } from '@nestjs/common';
import { OrdersServiceImpl } from './orders.service.impl';
import { OrdersRepository } from '../repository/orders.repository';
import { ProductsRepository } from '../../products/repository/products.repository';
import { OrdersEntity } from '../../entities/orders.entity';

const mockProduct = {
  id: 1,
  product_name: 'iPhone 15',
  count: 10,
};

const mockOrder: OrdersEntity = {
  id: 1,
  product_id: 1,
  customer_name: 'John Doe',
  mobile_phone: '998901234567',
  count: 2,
  state: 1,
  recall: false,
} as OrdersEntity;

describe('OrdersServiceImpl (unit)', () => {
  let service: OrdersServiceImpl;
  let ordersRepo: jest.Mocked<OrdersRepository>;
  let productsRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    ordersRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    productsRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new OrdersServiceImpl(ordersRepo, productsRepo);
  });

  it('should return paginated orders with product names', async () => {
    ordersRepo.findAndCount.mockResolvedValue([[mockOrder], 1]);
    productsRepo.find.mockResolvedValue([mockProduct as any]);

    const result = await service.findAll(1, 10);

    expect(ordersRepo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data[0].product_name).toBe('iPhone 15');
  });

  it('should default page and limit if NaN', async () => {
    ordersRepo.findAndCount.mockResolvedValue([[mockOrder], 1]);
    productsRepo.find.mockResolvedValue([mockProduct as any]);

    const result = await service.findAll(NaN, NaN);

    expect(ordersRepo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
  });

  it('should return single order with product info', async () => {
    ordersRepo.findOne.mockResolvedValue(mockOrder);
    productsRepo.findOneBy.mockResolvedValue(mockProduct as any);

    const result = await service.findOne({ id: 1 });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data.product.product_name).toBe('iPhone 15');
  });

  it('should not create if product stock is less than count', async () => {
    productsRepo.findOneBy.mockResolvedValue({
      ...mockProduct,
      count: 1,
    } as any);

    const result = await service.createOrder({
      product_id: 1,
      count: 5,
      customer_name: 'John',
      mobile_phone: '99890',
    });

    expect(result.message).toBe('There is not enough products in stock!');
    expect(result.data).toBeNull();
  });

  it('should create new order if enough stock', async () => {
    const product = { ...mockProduct };
    const newOrder = { id: 2, ...mockOrder };

    productsRepo.findOneBy.mockResolvedValue(product as any);
    productsRepo.save.mockResolvedValue({ ...product, count: 8 } as any);
    ordersRepo.create.mockReturnValue(newOrder as any);
    ordersRepo.save.mockResolvedValue(newOrder as any);

    const result = await service.createOrder({
      product_id: 1,
      count: 2,
      customer_name: 'Alex',
      mobile_phone: '99893',
    });

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data).toEqual(newOrder);
  });

  it('should return not found if order missing on update', async () => {
    ordersRepo.findOneBy.mockResolvedValue(null);
    productsRepo.find.mockResolvedValue([mockProduct as any]);

    const result = await service.updateOrder({ id: 1 }, {
      customer_name: 'New',
    } as any);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should update order successfully', async () => {
    const updated = { ...mockOrder, customer_name: 'Updated' };
    ordersRepo.findOneBy.mockResolvedValue(mockOrder);
    productsRepo.find.mockResolvedValue([mockProduct as any]);
    ordersRepo.save.mockResolvedValue(updated as any);

    const result = await service.updateOrder({ id: 1 }, {
      customer_name: 'Updated',
    } as any);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data.customer_name).toBe('Updated');
    expect(result.message).toBe('Order updated successfully!');
  });

  it('should return not found if order missing on delete', async () => {
    ordersRepo.findOneBy.mockResolvedValue(null);

    const result = await service.deleteOrder({ id: 1 });

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should delete order successfully', async () => {
    ordersRepo.findOneBy.mockResolvedValue(mockOrder);
    ordersRepo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteOrder({ id: 1 });

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockOrder);
    expect(result.message).toBe('Order deleted successfully');
  });
});
