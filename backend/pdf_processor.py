import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any
import re
from dotenv import load_dotenv
import tiktoken
import numpy as np
from openai import OpenAI
import pymongo
from pymongo import MongoClient
import PyPDF2
import pdfplumber
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PDFProcessor:
    def __init__(self, pdf_folder_path: str):
        """
        Initialize PDF processor
        
        Args:
            pdf_folder_path: Path to folder containing PDF files
        """
        self.pdf_folder_path = Path(pdf_folder_path)
        self.openai_client = OpenAI(
            base_url="https://api.aimlapi.com/v1",
            api_key=os.getenv("AIMLAPI_KEY"),
        )
        
        # MongoDB connection
        self.mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        self.db_name = os.getenv("MONGODB_DB_NAME", "nasa_hackathon")
        self.collection_name = os.getenv("MONGODB_COLLECTION_NAME", "organism_data")
        
        try:
            self.mongo_client = MongoClient(self.mongodb_url)
            self.db = self.mongo_client[self.db_name]
            self.collection = self.db[self.collection_name]
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        
        # Initialize tokenizer for chunking
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        
        # Chunking parameters
        self.chunk_size = 1000  # tokens per chunk
        self.chunk_overlap = 200  # overlap between chunks
    
    def extract_text_from_pdf(self, pdf_path: Path) -> str:
        """
        Extract text from PDF file using multiple methods for better accuracy
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Extracted text as string
        """
        text = ""
        
        try:
            # Method 1: Using pdfplumber (better for complex layouts)
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            # If pdfplumber didn't extract much text, try PyPDF2
            if len(text.strip()) < 100:
                logger.warning(f"pdfplumber extracted minimal text from {pdf_path.name}, trying PyPDF2")
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            
            # Clean up the text
            text = self.clean_text(text)
            
            if not text.strip():
                logger.warning(f"No text extracted from {pdf_path.name}")
            
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {e}")
            return ""
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page numbers and headers/footers (basic patterns)
        text = re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)
        text = re.sub(r'Page \d+ of \d+', '', text, flags=re.IGNORECASE)
        
        # Remove common PDF artifacts
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)\[\]\{\}\"\'\&\%\@\#\$\/\\]', '', text)
        
        # Normalize line breaks
        text = re.sub(r'\n+', '\n', text)
        
        return text.strip()
    
    def split_text_into_chunks(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Split text into chunks based on token count
        
        Args:
            text: Text to split
            metadata: Metadata to include with each chunk
            
        Returns:
            List of chunks with metadata
        """
        if not text.strip():
            return []
        
        # Tokenize the text
        tokens = self.tokenizer.encode(text)
        
        chunks = []
        start_idx = 0
        
        while start_idx < len(tokens):
            # Calculate end index for this chunk
            end_idx = min(start_idx + self.chunk_size, len(tokens))
            
            # Extract chunk tokens
            chunk_tokens = tokens[start_idx:end_idx]
            
            # Decode back to text
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            # Skip very short chunks (likely artifacts)
            if len(chunk_text.strip()) < 50:
                start_idx += self.chunk_size - self.chunk_overlap
                continue
            
            # Create chunk with metadata
            chunk = {
                **metadata,
                "content": chunk_text.strip(),
                "chunk_index": len(chunks),
                "token_count": len(chunk_tokens),
                "start_token": start_idx,
                "end_token": end_idx - 1
            }
            
            chunks.append(chunk)
            
            # Move start index with overlap
            start_idx += self.chunk_size - self.chunk_overlap
            
            # Prevent infinite loop
            if start_idx >= len(tokens):
                break
        
        return chunks
    
    def create_embedding(self, text: str) -> List[float]:
        """
        Create embedding for text using OpenAI embedding model
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector
        """
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-large",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error creating embedding: {e}")
            raise
    
    def extract_metadata_from_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        """
        Extract metadata from PDF file
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Metadata dictionary
        """
        metadata = {
            "filename": pdf_path.name,
            "file_path": str(pdf_path),
            "file_size": pdf_path.stat().st_size,
            "processed_at": datetime.utcnow().isoformat(),
            "source_type": "pdf"
        }
        
        try:
            # Try to extract PDF metadata
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                if pdf_reader.metadata:
                    pdf_metadata = pdf_reader.metadata
                    metadata.update({
                        "title": pdf_metadata.get("/Title", ""),
                        "author": pdf_metadata.get("/Author", ""),
                        "subject": pdf_metadata.get("/Subject", ""),
                        "creator": pdf_metadata.get("/Creator", ""),
                        "producer": pdf_metadata.get("/Producer", ""),
                        "creation_date": str(pdf_metadata.get("/CreationDate", "")),
                        "modification_date": str(pdf_metadata.get("/ModDate", ""))
                    })
                
                metadata["page_count"] = len(pdf_reader.pages)
        
        except Exception as e:
            logger.warning(f"Could not extract PDF metadata from {pdf_path.name}: {e}")
        
        return metadata
    
    def infer_organism_and_condition(self, text: str) -> Dict[str, str]:
        """
        Infer organism name and condition from text content
        
        Args:
            text: Text content to analyze
            
        Returns:
            Dictionary with inferred organism and condition
        """
        # Common organism patterns
        organism_patterns = [
            r'([A-Z][a-z]+ [a-z]+)',  # Genus species
            r'([A-Z][a-z]+ coli)',    # E. coli variations
            r'(E\.? coli)',           # E. coli
            r'(Saccharomyces cerevisiae)',  # Yeast
            r'(Drosophila melanogaster)',   # Fruit fly
            r'(Arabidopsis thaliana)',      # Plant
            r'(Caenorhabditis elegans)',    # Worm
            r'(Danio rerio)',               # Zebrafish
            r'(Mus musculus)',              # Mouse
        ]
        
        # Condition patterns
        condition_patterns = [
            r'(microgravity)',
            r'(radiation)',
            r'(temperature)',
            r'(hypoxia)',
            r'(hypergravity)',
            r'(space environment)',
            r'(zero gravity)',
            r'(cosmic radiation)',
            r'(thermal stress)',
            r'(oxidative stress)'
        ]
        
        organism_name = "Unknown"
        condition = "Not specified"
        
        # Find organism
        for pattern in organism_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                organism_name = match.group(1)
                break
        
        # Find condition
        for pattern in condition_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                condition = match.group(1).lower()
                break
        
        return {
            "organism_name": organism_name,
            "condition": condition
        }
    
    def store_chunks_in_mongodb(self, chunks: List[Dict[str, Any]]) -> int:
        """
        Store chunks in MongoDB with embeddings
        
        Args:
            chunks: List of chunks to store
            
        Returns:
            Number of chunks successfully stored
        """
        stored_count = 0
        
        for chunk in chunks:
            try:
                # Create embedding for the chunk content
                logger.info(f"Creating embedding for chunk {chunk['chunk_index']}...")
                embedding = self.create_embedding(chunk["content"])
                chunk["embedding"] = embedding
                
                # Store in MongoDB
                result = self.collection.insert_one(chunk)
                if result.inserted_id:
                    stored_count += 1
                    logger.info(f"Stored chunk {chunk['chunk_index']} with ID: {result.inserted_id}")
                else:
                    logger.error(f"Failed to store chunk {chunk['chunk_index']}")
                
            except Exception as e:
                logger.error(f"Error storing chunk {chunk['chunk_index']}: {e}")
        
        return stored_count
    
    def process_pdf_file(self, pdf_path: Path) -> Dict[str, Any]:
        """
        Process a single PDF file
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Processing results
        """
        logger.info(f"Processing PDF: {pdf_path.name}")
        
        try:
            # Extract text
            text = self.extract_text_from_pdf(pdf_path)
            if not text.strip():
                return {
                    "filename": pdf_path.name,
                    "status": "failed",
                    "error": "No text extracted",
                    "chunks_created": 0,
                    "chunks_stored": 0
                }
            
            # Extract metadata
            metadata = self.extract_metadata_from_pdf(pdf_path)
            
            # Infer organism and condition
            inferred_info = self.infer_organism_and_condition(text)
            metadata.update(inferred_info)
            
            # Add text statistics
            metadata.update({
                "total_text_length": len(text),
                "total_tokens": len(self.tokenizer.encode(text))
            })
            
            # Split into chunks
            chunks = self.split_text_into_chunks(text, metadata)
            logger.info(f"Created {len(chunks)} chunks from {pdf_path.name}")
            
            # Store chunks in MongoDB
            stored_count = self.store_chunks_in_mongodb(chunks)
            
            return {
                "filename": pdf_path.name,
                "status": "success",
                "text_length": len(text),
                "total_tokens": len(self.tokenizer.encode(text)),
                "chunks_created": len(chunks),
                "chunks_stored": stored_count,
                "organism_name": inferred_info["organism_name"],
                "condition": inferred_info["condition"]
            }
            
        except Exception as e:
            logger.error(f"Error processing {pdf_path.name}: {e}")
            return {
                "filename": pdf_path.name,
                "status": "failed",
                "error": str(e),
                "chunks_created": 0,
                "chunks_stored": 0
            }
    
    def process_all_pdfs(self) -> Dict[str, Any]:
        """
        Process all PDF files in the specified folder
        
        Returns:
            Processing summary
        """
        if not self.pdf_folder_path.exists():
            raise ValueError(f"PDF folder does not exist: {self.pdf_folder_path}")
        
        # Find all PDF files
        pdf_files = list(self.pdf_folder_path.glob("*.pdf"))
        if not pdf_files:
            logger.warning(f"No PDF files found in {self.pdf_folder_path}")
            return {"total_files": 0, "processed_files": 0, "results": []}
        
        logger.info(f"Found {len(pdf_files)} PDF files to process")
        
        # Process each PDF file
        results = []
        for pdf_file in pdf_files:
            result = self.process_pdf_file(pdf_file)
            results.append(result)
        
        # Calculate summary
        successful_files = [r for r in results if r["status"] == "success"]
        failed_files = [r for r in results if r["status"] == "failed"]
        
        total_chunks_created = sum(r["chunks_created"] for r in successful_files)
        total_chunks_stored = sum(r["chunks_stored"] for r in successful_files)
        
        summary = {
            "total_files": len(pdf_files),
            "successful_files": len(successful_files),
            "failed_files": len(failed_files),
            "total_chunks_created": total_chunks_created,
            "total_chunks_stored": total_chunks_stored,
            "results": results
        }
        
        logger.info(f"Processing complete: {len(successful_files)}/{len(pdf_files)} files processed successfully")
        logger.info(f"Total chunks created: {total_chunks_created}, stored: {total_chunks_stored}")
        
        return summary
    
    def create_mongodb_indexes(self):
        """
        Create indexes for better query performance
        """
        try:
            # Create text index for organism_name and condition
            self.collection.create_index([
                ("organism_name", "text"),
                ("condition", "text"),
                ("content", "text")
            ])
            
            # Create index on filename
            self.collection.create_index("filename")
            
            # Create index on processed_at
            self.collection.create_index("processed_at")
            
            logger.info("MongoDB indexes created successfully")
            
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")

def main():
    """
    Main function to run the PDF processor
    """
    # Get PDF folder path from command line or use default
    import sys
    if len(sys.argv) > 1:
        pdf_folder_path = sys.argv[1]
    else:
        pdf_folder_path = input("Enter path to PDF folder: ").strip()
    
    if not pdf_folder_path:
        pdf_folder_path = "./pdfs"  # Default folder
    
    try:
        # Initialize processor
        processor = PDFProcessor(pdf_folder_path)
        
        # Create MongoDB indexes
        processor.create_mongodb_indexes()
        
        # Process all PDFs
        summary = processor.process_all_pdfs()
        
        # Print summary
        print("\n" + "="*50)
        print("PDF PROCESSING SUMMARY")
        print("="*50)
        print(f"Total files: {summary['total_files']}")
        print(f"Successful: {summary['successful_files']}")
        print(f"Failed: {summary['failed_files']}")
        print(f"Total chunks created: {summary['total_chunks_created']}")
        print(f"Total chunks stored: {summary['total_chunks_stored']}")
        
        if summary['failed_files'] > 0:
            print("\nFailed files:")
            for result in summary['results']:
                if result['status'] == 'failed':
                    print(f"  - {result['filename']}: {result.get('error', 'Unknown error')}")
        
        # Save detailed results to JSON
        output_file = f"processing_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"\nDetailed results saved to: {output_file}")
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
