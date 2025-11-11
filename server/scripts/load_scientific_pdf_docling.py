import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))

import pandas as pd
from services.scientific_pdf_loader import ScientificPDFLoader

# Example usage
if __name__ == "__main__":
  # Initialize parser
  parser = ScientificPDFLoader(extract_tables=True, skip_references=True)

  # Parse PDF (either file or URL)
  pdf_path = "/home/kamil/repos/nnda/server/scripts/example2.pdf"
  sections = parser.parse_pdf(pdf_path)

  # Prepare data for CSV
  rows = []
  for section in sections:
    rows.append(
      {
        "heading": section.get("heading", ""),
        "page_number": section.get("page_number", ""),
        "content_length": len(section.get("content", "")),
        "full_content": section.get("content", ""),
      }
    )

  # Create DataFrame and save
  df = pd.DataFrame(rows)
  df.to_csv("chunks_output.csv", index=False)

  # Print sections
  for section in sections:
    print(f"\n{'=' * 60}")
    # print(f"Section: {section['section_number']} {section['section_title']}")
    print(f"Heading: {section.get('heading', 'N/A')}")
    print(f"Page: {section.get('page_number', 'N/A')}")
    # print(f"Metadata: {section.get('metadata', 'N/A')}")
    # print(section['content'])
    print(f"{'=' * 60}")
