from langchain_docling.loader import DoclingLoader
from docling.datamodel.base_models import InputFormat
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions, TableFormerMode
from docling_core.transforms.chunker.hybrid_chunker import HybridChunker
from docling_core.transforms.chunker.tokenizer.huggingface import HuggingFaceTokenizer
from transformers import AutoTokenizer


class ScientificPDFLoader:
  """
  Provides clean and accurate PDF extraction and chunking using Docling library.
  """

  def __init__(
    self,
    extract_tables: bool = True,
    skip_references: bool = True,
  ):
    """
    Initialize parser with Docling converter.

    Args:
        extract_tables: Whether to extract tables from PDFs
        skip_references: Whether to filter out references sections

    """
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B")
    docling_tokenizer = HuggingFaceTokenizer(tokenizer=tokenizer, max_tokens=512)
    self.chunker = HybridChunker(tokenizer=docling_tokenizer, merge_peers=True)

    self.extract_tables = extract_tables
    self.skip_references = skip_references

    # Configure PDF pipeline options
    pipeline_options = PdfPipelineOptions()
    pipeline_options.do_table_structure = extract_tables

    if extract_tables:
      # Use ACCURATE mode for better table extraction
      pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE

    # Create converter with options
    self.converter = DocumentConverter(
      format_options={InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)}
    )

  def parse_pdf(self, pdf_path: str) -> list[dict]:
    """
    Parse PDF and return structured sections.

    Args:
        pdf_path: Path to PDF file (local or URL)

    Returns:
        List of section dictionaries with metadata

    """
    # Load PDF using Docling with doc chunks mode
    loader = DoclingLoader(
      file_path=pdf_path,
      converter=self.converter,
      chunker=self.chunker,
    )

    # Load all documents/chunks
    documents = loader.load()

    # Process documents into sections
    sections = self._process_documents(documents)

    # Filter references if requested
    if self.skip_references:
      sections = self._filter_out_references(sections)

    return sections

  def _process_documents(self, documents: list) -> list[dict]:
    """
    Convert LangChain documents to structured sections.

    Docling automatically detects document structure including:
    - Sections and subsections
    - Tables
    - Figures
    - Captions
    """
    sections = []

    for doc in documents:
      # Extract metadata
      heading, page_number = None, None
      metadata = doc.metadata
      # access heading info
      headings = metadata.get("dl_meta", {}).get("headings", [])
      heading = headings[0] if headings else None
      # access page number info
      doc_items = metadata.get("dl_meta", {}).get("doc_items", [])

      if doc_items and doc_items[0].get("prov"):
        # This is the corrected nested access
        provenance = doc_items[0]["prov"]
        page_number = provenance[0].get("page_no") if provenance else None

      section_info = {
        "content": doc.page_content.strip(),
        "heading": heading,
        "page_number": page_number,
        "metadata": metadata,
      }

      sections.append(section_info)

    return sections

  def _filter_out_references(self, sections: list[dict]) -> list[dict]:
    """
    Filter out references/bibliography sections.
    """
    filtered = []

    reference_keywords = [
      "reference",
      "bibliography",
      "works cited",
      "literature cited",
      "cited literature",
    ]

    for section in sections:
      heading_lower = section.get("heading", "").lower()

      # Skip if matches reference keywords
      is_reference = any(keyword in heading_lower for keyword in reference_keywords)

      if not is_reference:
        filtered.append(section)
      else:
        print(f"✂️  Filtered out references section: {section.get('heading', 'Unknown')}")

    return filtered
