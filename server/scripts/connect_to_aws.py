import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
try:
  conn = psycopg2.connect(  # Will work only for whitelisted IPs
    host=os.getenv("AWS_HOST"),
    port=5432,
    dbname="postgres",
    user=os.getenv("AWS_MASTER_USERNAME"),
    password=os.getenv("AWS_DATABASE_PASSWORD"),
  )
  print("Connected:", conn.get_dsn_parameters())
  conn.close()
except Exception as e:
  print("❌ Connection failed:", e)
