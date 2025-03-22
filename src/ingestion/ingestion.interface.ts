export interface DocumentIngestionResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface DocumentEmbedding {
  id: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface IngestionInterface {
  ingestDocument(
    file: Express.Multer.File,
    metadata?: Record<string, any>,
  ): DocumentIngestionResponse;
  getIngestionStatus(id: string): DocumentIngestionResponse;
  getDocumentEmbeddings(query: string, limit?: number): DocumentEmbedding[];
}
