import { HttpStatus } from '@nestjs/common';
import { AddressesServiceImpl } from './addresses.service.impl';
import { AddressesRepository } from '../repository/addresses.repository';

jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
}));

export const mockAddress = {
  id: 1,
  address: 'Tashkent, Chilonzor',
  description: 'Main office address',
  location: '41.2995, 69.2401',
  image: 'test.png',
  isActive: true,
  state: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
describe('AddressesServiceImpl (unit)', () => {
  let service: AddressesServiceImpl;
  let repo: jest.Mocked<AddressesRepository>;

  beforeEach(() => {
    repo = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new AddressesServiceImpl(repo);
  });

  it('should return paginated data', async () => {
    repo.findAndCount.mockResolvedValue([[mockAddress as any], 1]);

    const result = await service.findAll(1, 10);

    expect(repo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual([mockAddress]);
  });

  it('should default page and limit if NaN', async () => {
    repo.findAndCount.mockResolvedValue([[mockAddress as any], 1]);
    const result = await service.findAll(NaN, NaN);

    expect(repo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual([mockAddress]);
  });

  it('should not create if address already exists', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1 } as any);

    const result = await service.createAddress(
      { address: 'Tashkent', description: 'desc', location: 'loc' },
      'img.png',
    );

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.data).toBeNull();
  });

  it('should create new address', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockReturnValue({
      save: jest.fn().mockResolvedValue({ id: 2, address: 'New' }),
    } as any);

    const result = await service.createAddress(
      { address: 'New', description: 'desc', location: 'loc' },
      'img.png',
    );

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data).toEqual({ id: 2, address: 'New' });
  });

  it('should return not found if address missing', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.updateAddress(
      { id: 1 },
      mockAddress,
      'img.png',
    );

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should update address', async () => {
    repo.findOneBy.mockResolvedValue(mockAddress as any);
    repo.update.mockResolvedValue([{ id: 1, address: 'Updated' }] as any);

    const result = await service.updateAddress(
      { id: 1 },
      { address: 'Updated' } as any,
      'img.png',
    );

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.message).toBe('Address updated successfully!');
  });

  it('should delete address and unlink file', async () => {
    repo.findOneBy.mockResolvedValue(mockAddress as any);
    repo.delete.mockResolvedValue({
      affected: 1,
    } as any);

    const result = await service.deleteAddress({ id: 1 });

    expect(result.message).toBe('Address deleted successfully');
  });

  it('should return not found if address missing on delete', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteAddress({ id: 1 });
    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Address not found!');
  });
});
