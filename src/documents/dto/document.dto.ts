import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Annual Report 2023',
  })
  title: string;

  @ApiProperty({
    description: 'Document description',
    example: 'Annual financial report for the year 2023',
  })
  description: string;
}

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Updated Annual Report 2023',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Document description',
    example: 'Updated annual financial report for the year 2023',
    required: false,
  })
  description?: string;
}

export class CreateDocumentResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Document created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Document data',
    example: {
      id: '5b8fa43a-1517-4d48-97eb-d84cbbd7ebb1',
      title: 'Annual Report 2023',
      description: 'Annual financial report for the year 2023',
      fileName: 'aa.png',
      fileSize: 45841,
      mimeType: 'image/png',
      createdAt: '2025-03-22T12:34:05.041Z',
      fileUrl:
        'http://localhost:3000/uploads/1742646845036-8f5c212c-5c56-46d5-b3ee-0c98e5481b5c.png',
      owner: '4155ff5c-dc0c-4633-84c7-690a23e7a419',
    },
  })
  data: any;
}

export class GetAllDocumentsResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Documents retrieved successfully',
  })
  message: string;
  @ApiProperty({
    description: 'Documents data',
    example: [
      {
        id: '5b8fa43a-1517-4d48-97eb-d84cbbd7ebb1',
        title: 'Annual Report 2023',
        description: 'Annual financial report for the year 2023',
        fileName: 'aa.png',
        fileSize: 45841,
        mimeType: 'image/png',
        owner: {
          id: '4155ff5c-dc0c-4633-84c7-690a23e7a419',
          email: 'editor@gmail.com',
        },
        createdAt: '2025-03-22T12:34:05.041Z',
        fileUrl:
          'http://localhost:3000/uploads/1742646845036-8f5c212c-5c56-46d5-b3ee-0c98e5481b5c.png',
      },
    ],
  })
  data: {
    id: string;
    title: string;
    description: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    owner: { id: string; email: string };
    createdAt: string;
    fileUrl: string;
  }[];
}

// get document by id response
export class GetDocumentByIdResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Document retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Document data',
    example: {
      id: '5b8fa43a-1517-4d48-97eb-d84cbbd7ebb1',
      title: 'Annual Report 2023',
      description: 'Annual financial report for the year 2023',
      fileName: 'aa.png',
      fileSize: 45841,
      mimeType: 'image/png',
      owner: {
        id: '4155ff5c-dc0c-4633-84c7-690a23e7a419',
        email: 'editor@gmail.com',
      },
      createdAt: '2025-03-22T12:34:05.041Z',
      fileUrl:
        'http://localhost:3000/uploads/1742646845036-8f5c212c-5c56-46d5-b3ee-0c98e5481b5c.png',
    },
  })
  data: {
    id: string;
    title: string;
    description: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    owner: { id: string; email: string };
    createdAt: string;
    fileUrl: string;
  };
}

// update document response
export class UpdateDocumentResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Document updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Document data',
    example: {
      id: '5b8fa43a-1517-4d48-97eb-d84cbbd7ebb1',
      title: 'Updated Annual Report 2023',
      description: 'Updated annual financial report for the year 2023',
      fileName: 'aa.png',
      fileSize: 45841,
      mimeType: 'image/png',
      owner: {
        id: '4155ff5c-dc0c-4633-84c7-690a23e7a419',
        email: 'editor@gmail.com',
      },
      createdAt: '2025-03-22T12:34:05.041Z',
      fileUrl:
        'http://localhost:3000/uploads/1742646845036-8f5c212c-5c56-46d5-b3ee-0c98e5481b5c.png',
    },
  })
  data: {
    id: string;
    title: string;
    description: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    owner: { id: string; email: string };
    createdAt: string;
    fileUrl: string;
  };
}
