import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { EmbeddingsService } from './embeddings.service';
import {
  DocumentEmbedding,
  DocumentIngestionResponse,
} from 'src/ingestion/ingestion.interface';

@ApiTags('embeddings')
@ApiBearerAuth('JWT')
@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document for embedding' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to embed',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the document',
          additionalProperties: true,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded for embedding processing',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        status: { type: 'string', example: 'processing' },
      },
    },
  })
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata?: Record<string, any>,
  ): DocumentIngestionResponse {
    return this.embeddingsService.uploadDocument(file, metadata);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Check document ingestion status' })
  @ApiParam({
    name: 'id',
    description: 'Document ingestion ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Document ingestion status',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        status: {
          type: 'string',
          enum: ['processing', 'completed', 'failed'],
          example: 'completed',
        },
        message: { type: 'string', example: 'Document processed successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Ingestion not found' })
  getDocumentStatus(@Param('id') id: string): DocumentIngestionResponse {
    return this.embeddingsService.getDocumentStatus(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search documents by semantic query' })
  @ApiQuery({
    name: 'query',
    description: 'Search query',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results to return',
    type: 'number',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          embedding: {
            type: 'array',
            items: { type: 'number' },
            description: 'Vector embedding of the document',
          },
          metadata: {
            type: 'object',
            properties: {
              filename: { type: 'string', example: 'annual-report-2023.pdf' },
              mimeType: { type: 'string', example: 'application/pdf' },
              size: { type: 'number', example: 2048576 },
            },
            additionalProperties: true,
          },
        },
      },
    },
  })
  searchDocuments(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ): DocumentEmbedding[] {
    return this.embeddingsService.searchDocuments(query, limit);
  }
}
