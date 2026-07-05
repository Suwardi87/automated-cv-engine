import { Test, TestingModule } from '@nestjs/testing';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

describe('EducationController', () => {
  let controller: EducationController;
  let service: jest.Mocked<EducationService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationController],
      providers: [{ provide: EducationService, useValue: mockService }],
    }).compile();

    controller = module.get(EducationController);
    service = module.get(EducationService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return list of education for current user', async () => {
      const mockData = [{ id: 1, institution: 'UI' }];
      service.findAll.mockResolvedValue(mockData as any);

      const result = await controller.index({ id: 1 } as any);

      expect(result).toEqual({ success: true, data: mockData });
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return education record', async () => {
      const dto = { institution: 'UI', degree: 'S1' };
      const created = { id: 1, ...dto };
      service.create.mockResolvedValue(created as any);

      const result = await controller.create({ id: 1 } as any, dto);

      expect(result).toEqual({ success: true, data: created });
    });
  });

  describe('update', () => {
    it('should update and return education record', async () => {
      const updated = { id: 1, institution: 'UI', degree: 'S2' };
      service.update.mockResolvedValue(updated as any);

      const result = await controller.update({ id: 1 } as any, '1', { degree: 'S2' });

      expect(result).toEqual({ success: true, data: updated });
      expect(service.update).toHaveBeenCalledWith(1, 1, { degree: 'S2' });
    });
  });

  describe('destroy', () => {
    it('should delete education record', async () => {
      service.remove.mockResolvedValue(undefined as any);

      const result = await controller.destroy({ id: 1 } as any, '1');

      expect(result).toEqual({ success: true, data: null });
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
});
