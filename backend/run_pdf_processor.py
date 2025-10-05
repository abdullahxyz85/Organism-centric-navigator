#!/usr/bin/env python3
"""
Simple script to run the PDF processor with a specified folder
"""

import sys
import os
from pathlib import Path
from pdf_processor import PDFProcessor

def main():
    """
    Main function to run PDF processor with command line arguments
    """
    # Check if PDF folder path is provided
    if len(sys.argv) > 1:
        pdf_folder_path = sys.argv[1]
    else:
        # Default to 'pdfs' folder in current directory
        pdf_folder_path = "./pdfs"
    
    # Check if folder exists
    if not Path(pdf_folder_path).exists():
        print(f"Error: PDF folder '{pdf_folder_path}' does not exist.")
        print("Please create the folder and add PDF files, or provide a different path.")
        print("\nUsage examples:")
        print(f"  python {sys.argv[0]} ./my_pdfs")
        print(f"  python {sys.argv[0]} /path/to/pdf/folder")
        print(f"  python {sys.argv[0]}  # Uses ./pdfs by default")
        return 1
    
    # Check if folder contains PDF files
    pdf_files = list(Path(pdf_folder_path).glob("*.pdf"))
    if not pdf_files:
        print(f"Error: No PDF files found in '{pdf_folder_path}'")
        print("Please add PDF files to the folder and try again.")
        return 1
    
    print(f"Found {len(pdf_files)} PDF files in '{pdf_folder_path}'")
    print("Starting PDF processing...")
    print("-" * 50)
    
    try:
        # Initialize processor
        processor = PDFProcessor(pdf_folder_path)
        
        # Create MongoDB indexes
        print("Setting up MongoDB indexes...")
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
        
        print("\nProcessing completed successfully!")
        return 0
        
    except Exception as e:
        print(f"Error processing PDFs: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
