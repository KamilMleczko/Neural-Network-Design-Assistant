from supabase import create_client, Client
from .config_loader import settings


supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_API_KEY)
