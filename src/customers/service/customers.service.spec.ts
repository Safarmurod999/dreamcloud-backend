import { HttpStatus } from '@nestjs/common';
import { CustomersServiceImpl } from './customers.service.impl';
import { CustomersRepository } from '../repository/categories.repository';
import { CustomersEntity } from '../../entities/customers.entity';

export const mockCustomer: CustomersEntity = {
  id: 1,
  mobile_phone: '998901112233',
  recall: false,
} as CustomersEntity;

describe('CustomersServiceImpl (unit)', () => {
  let service: CustomersServiceImpl;
  let repo: jest.Mocked<CustomersRepository>;

  beforeEach(() => {
    repo = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new CustomersServiceImpl(repo);
  });

  it('should return paginated data', async () => {
    repo.findAndCount.mockResolvedValue([[mockCustomer], 1]);

    const result = await service.findAll(1, 10);

    expect(repo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual([mockCustomer]);
    expect(result.pagination.totalPages).toBe(1);
  });

  it('should default page and limit if NaN', async () => {
    repo.findAndCount.mockResolvedValue([[mockCustomer], 1]);

    const result = await service.findAll(NaN, NaN);

    expect(repo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual([mockCustomer]);
  });

  it('should not create if customer already exists', async () => {
    repo.findOneBy.mockResolvedValue(mockCustomer);

    const result = await service.createCustomer({
      mobile_phone: '998901112233',
    });

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.data).toBeNull();
  });

  it('should create new customer', async () => {
    const dto = { mobile_phone: '998909876543' };
    const created = { id: 2, ...dto } as CustomersEntity;

    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const result = await service.createCustomer(dto);

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data).toEqual(created);
    expect(repo.save).toHaveBeenCalledWith(created);
  });

  it('should return not found if customer missing on update', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.updateCustomer({ id: 1 }, {
      mobile_phone: '99890',
    } as any);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should update customer', async () => {
    const existing = { ...mockCustomer };
    repo.findOneBy.mockResolvedValue(existing as any);
    repo.save.mockResolvedValue({ ...existing, mobile_phone: '99890' } as any);

    const result = await service.updateCustomer(
      { id: 1 },
      { mobile_phone: '99890', recall: true },
    );

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data.mobile_phone).toBe('99890');
    expect(result.data.recall).toBe(true);
  });

  it('should return not found if customer missing on delete', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.deleteCustomer({ id: 1 });

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should delete customer successfully', async () => {
    repo.findOneBy.mockResolvedValue(mockCustomer);
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteCustomer({ id: 1 });

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockCustomer);
    expect(result.message).toBe('Customer deleted successfully');
  });
});
