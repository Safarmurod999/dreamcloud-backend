import { CategoriesServiceImpl } from './categories.service.impl';
import { HttpStatus } from '@nestjs/common';

describe('CategoriesServiceImpl (unit)', () => {
  let service: CategoriesServiceImpl;
  let mockCategoriesRepo: any;
  let mockProductsRepo: any;
  let mockOrdersRepo: any;

  beforeEach(() => {
    mockCategoriesRepo = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    mockProductsRepo = {
      softDelete: jest.fn(),
    };
    mockOrdersRepo = {
      softDelete: jest.fn(),
    };

    service = new CategoriesServiceImpl(
      mockCategoriesRepo,
      mockProductsRepo,
      mockOrdersRepo,
    );
  });

  it('findAll() -> returns paginated data', async () => {
    mockCategoriesRepo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await service.findAll(1, 10);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data[0].id).toBe(1);
    expect(result.pagination.totalCount).toBe(1);
  });

  it('findAll() -> handles NaN page and limit', async () => {
    mockCategoriesRepo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
    const result = await service.findAll(NaN, NaN);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data[0].id).toBe(1);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  it('createCategory() -> returns BAD_REQUEST if category exists', async () => {
    mockCategoriesRepo.findOneBy.mockResolvedValue({
      id: 1,
      category_name: 'test',
    });

    const result = await service.createCategory({ category_name: 'test' });

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.data).toBeNull();
    expect(result.message).toBe('Category already exists!');
  });

  it('createCategory() -> creates new category if not exists', async () => {
    const mockCategory = { id: 2, category_name: 'new' };
    mockCategoriesRepo.findOneBy.mockResolvedValue(null);
    mockCategoriesRepo.create.mockReturnValue(mockCategory);
    mockCategoriesRepo.save.mockResolvedValue(mockCategory);

    const result = await service.createCategory({ category_name: 'new' });

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data).toEqual(mockCategory);
    expect(result.message).toBe('Category created successfully!');
  });

  it('updateCategory() -> returns NOT_FOUND if category does not exist', async () => {
    mockCategoriesRepo.findOneBy.mockResolvedValue(null);

    const result = await service.updateCategory({ id: 1 }, {
      category_name: 'upd',
    } as any);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.data).toBeNull();
    expect(result.message).toBe('Category not found!');
  });

  it('updateCategory() -> updates category if exists', async () => {
    const mockCategory = {
      id: 1,
      category_name: 'old',
      isActive: true,
      state: 1,
    };
    mockCategoriesRepo.findOneBy.mockResolvedValue(mockCategory);
    mockCategoriesRepo.update.mockResolvedValue({
      raw: [{ id: 1, category_name: 'upd' }],
    });

    const result = await service.updateCategory({ id: 1 }, {
      category_name: 'upd',
    } as any);

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data[0].id).toBe(1);
    expect(result.message).toBe('Category updated successfully!');
  });

  it('deleteCategory() -> deletes product, order and category', async () => {
    mockProductsRepo.softDelete.mockResolvedValue({ raw: [{ id: 10 }] });
    mockOrdersRepo.softDelete.mockResolvedValue({ raw: [] });
    mockCategoriesRepo.softDelete.mockResolvedValue({ raw: [{ id: 1 }] });

    const result = await service.deleteCategory({ id: 1 });

    expect(mockProductsRepo.softDelete).toHaveBeenCalledWith(1);
    expect(mockOrdersRepo.softDelete).toHaveBeenCalledWith(10);
    expect(mockCategoriesRepo.softDelete).toHaveBeenCalledWith(1);

    expect(result.status).toBe(200);
    expect(result.data[0].id).toBe(1);
    expect(result.message).toBe('Category deleted successfully');
  });
});
