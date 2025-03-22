import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  createDocumentSchema,
  updateDocumentSchema,
} from './schema/document.schema';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { getFilePath } from 'src/utils/helper';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body(new ZodValidationPipe(createDocumentSchema))
    createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const document = await this.documentsService.create(
      createDocumentDto,
      file,
      req?.user?.id as string,
    );

    return {
      message: 'Document created successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
        fileUrl: getFilePath(document.filePath),
        owner: document.ownerId,
      },
    };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const documents = await this.documentsService.findAll(
      req.user as Express.User,
    );

    return {
      message: 'Documents retrieved successfully',
      data: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        owner: {
          id: doc.owner?.id,
          email: doc.owner?.email,
        },
        createdAt: doc.createdAt,
        fileUrl: getFilePath(doc.filePath),
      })),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const document = await this.documentsService.findOne(
      id,
      req.user as Express.User,
    );

    return {
      message: 'Document retrieved successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        owner: {
          id: document.owner?.id,
          email: document.owner?.email,
        },
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateDocumentSchema))
    updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const document = await this.documentsService.update(
      id,
      updateDocumentDto,
      req.user as Express.User,
      file,
    );

    return {
      message: 'Document updated successfully',
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        updatedAt: document.updatedAt,
        fileUrl: getFilePath(document.filePath),
        owner: {
          id: document.owner?.id,
          email: document.owner?.email,
        },
      },
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    await this.documentsService.remove(id, req.user as Express.User);

    return {
      message: 'Document deleted successfully',
    };
  }
}
