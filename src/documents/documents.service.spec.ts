import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as fs from 'fs';
import { UserRole } from 'src/users/entities/user.entity';

jest.mock('fs'); // Mock file system operations
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
  }));


describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  const mockDocument = {
    id: 'doc1',
    title: 'Test Document',
    fileName: 'test.pdf',
    filePath: 'uploads/test.pdf',
    fileSize: 1234,
    mimeType: 'application/pdf',
    ownerId: 'editor1',
  };

  const mockUserAdmin = { id: 'admin1', role: UserRole.ADMIN, email: 'admin@gmail.com'};
  const mockEditor = { id: 'editor1', role: UserRole.EDITOR, email: 'editor@gmail.com' };
  const mockViewer = { id: 'viewer1', role: UserRole.VIEWER, email: 'viewer@gmail.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a document', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockDocument as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockDocument as any);

      const file = { originalname: 'test.pdf', path: 'uploads/test.pdf', size: 1234, mimetype: 'application/pdf' } as Express.Multer.File;

      const result = await service.create(
        {
            title: 'Test Document',
            description: ''
        },
        file,
        'editor1',
      );

      expect(result).toEqual(mockDocument);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Document' }));
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw an error if document creation fails', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('DB Error'));

      await expect(
        service.create({
            title: 'Test',
            description: ''
        }, {} as Express.Multer.File, 'editor1'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all documents for an admin', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockDocument] as any);

      const result = await service.findAll(mockUserAdmin);

      expect(result).toEqual([mockDocument]);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['owner'] });
    });

    it('should return only user-owned documents for non-admin', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockDocument] as any);

      const result = await service.findAll(mockEditor);

      expect(result).toEqual([mockDocument]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { ownerId: 'editor1' },
        relations: ['owner'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a document if found and authorized', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockDocument as any);

      const result = await service.findOne('doc1', mockUserAdmin);
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999', mockUserAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({...mockDocument, ownerId: 'editor2'} as any);

      await expect(service.findOne('doc1', mockEditor)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update and return document', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockDocument as any);
      jest.spyOn(fs, 'unlinkSync').mockImplementation();

      const result = await service.update(
        'doc1',
        { title: 'Updated Title' },
        mockEditor,
      );

      expect(result).toEqual(mockDocument);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument as any);

      await expect(
        service.update('doc1', { title: 'Updated' }, mockViewer),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a document if authorized', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockDocument as any);
      jest.spyOn(fs, 'unlinkSync').mockImplementation();

      await service.remove('doc1', mockUserAdmin);

      expect(repository.remove).toHaveBeenCalledWith(mockDocument);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument as any);

      await expect(service.remove('doc1', mockViewer)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
