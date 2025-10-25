# """
# Simple LangChain implementation to load a PDF into Pinecone
# Uses OpenAI embeddings (can switch to local embeddings easily)
# """

# import os
# import pprint

# from dotenv import load_dotenv
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyMuPDFLoader
# from langchain_openai import OpenAIEmbeddings
# from langchain_pinecone import PineconeVectorStore
# from pinecone import Pinecone, ServerlessSpec

# # Load environment variables
# load_dotenv()


# class PDFProcessor:
#   """:Load PDFs into Pinecone using LangChain"""

#   def __init__(self):
#     """
#     Initialize the loader
#     """
#     # Initialize text splitter
#     self.text_splitter = RecursiveCharacterTextSplitter(
#       chunk_size=1000,  # Characters per chunk
#       chunk_overlap=200,  # Overlap between chunks
#       length_function=len,
#     )

#   def load_pdf(self, pdf_path: str) -> dict:
#     """
#     Load a single PDF file into Pinecone.

#     Args:
#         pdf_path: Path to the PDF file.

#     Returns:
#         dict: Statistics about the loading process.

#     """
#     if not os.path.exists(pdf_path):
#       raise FileNotFoundError(f"PDF file not found: {pdf_path}")

#     filename = os.path.basename(pdf_path)
#     print(f"\nLoading PDF: {filename}")
#     print("=" * 60)

#     # Step 1: Load PDF
#     print("1. Loading PDF and extracting text...")
#     loader = (
#       PyMuPDFLoader(  # it is possible to extract images too, but for now we'll stick to text only
#         pdf_path,
#         mode="page",  # page end acts as delimiter for chunking
#       )
#     )
#     documents = loader.load()
#     print(len(documents))
#     pprint.pp(documents[0].metadata)
#     print(f"   ✓ Extracted {len(documents)} pages")

#     # Step 2: Split into chunks
#     print("2. Splitting text into chunks...")
#     chunks = self.text_splitter.split_documents(documents)
#     print(f"   ✓ Created {len(chunks)} chunks")

#     # Add metadata to each chunk
#     for i, chunk in enumerate(chunks):
#       chunk.metadata.update({"source": filename, "chunk_index": i, "total_chunks": len(chunks)})

#     # Step 3: Generate embeddings and upload to Pinecone
#     print("3. Generating embeddings and uploading to Pinecone...")
#     vector_store = PineconeVectorStore.from_documents(
#       documents=chunks, embedding=self.embeddings, index_name=self.index_name
#     )
#     print(f"   ✓ Uploaded {len(chunks)} vectors to Pinecone")

#     print("=" * 60)
#     print("✓ PDF successfully loaded into Pinecone!\n")

#     return {
#       "filename": filename,
#       "pages": len(documents),
#       "chunks": len(chunks),
#       "index_name": self.index_name,
#     }
