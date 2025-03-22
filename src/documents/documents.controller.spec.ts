import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

const mockUser = {
  id: 'user-id-123',
  email: 'test@example.com',
  role: UserRole.EDITOR,
};

const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test-document.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('test file content'),
  size: 1024,
  destination: 'uploads/',
  filename: 'test-document.pdf',
  path: 'uploads/test-document.pdf',
  stream: null as any,
};

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'doc-id-123', ...mockFile }),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 'doc-id-123', ...mockFile }),
            update: jest.fn().mockResolvedValue({ id: 'doc-id-123', ...mockFile }),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if no file is uploaded', async () => {
    await expect(
      controller.create(
        { title: 'Test Document', description: 'Test Description' },
        null as any, // Test case for missing file
        { user: mockUser } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a document successfully', async () => {
    const result = await controller.create(
      { title: 'Test Document', description: 'Test Description' },
      mockFile,
      { user: mockUser } as any,
    );

    expect(result).toEqual({
      message: 'Document created successfully',
      data: expect.objectContaining({ id: 'doc-id-123' }),
    });
  });

  it('should retrieve all documents', async () => {
    const result = await controller.findAll({ user: mockUser } as any);
    expect(result).toEqual({ message: 'Documents retrieved successfully', data: [] });
  });

  it('should retrieve a document by ID', async () => {
    const result = await controller.findOne('doc-id-123', { user: mockUser } as any);
    expect(result).toEqual({
      message: 'Document retrieved successfully',
      data: expect.objectContaining({ id: 'doc-id-123' }),
    });
  });

  it('should update a document', async () => {
    const result = await controller.update(
      'doc-id-123',
      { title: 'Updated Title', description: 'Updated Description' },
      mockFile,
      { user: mockUser } as any,
    );

    expect(result).toEqual({
      message: 'Document updated successfully',
      data: expect.objectContaining({ id: 'doc-id-123' }),
    });
  });

  it('should delete a document', async () => {
    const result = await controller.remove('doc-id-123', { user: mockUser } as any);
    expect(result).toEqual({ message: 'Document deleted successfully' });
  });
});
