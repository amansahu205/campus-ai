import yaml
from pathlib import Path

def load_source_config(university_id: str, domain: str) -> dict:
    """
    Loads a YAML configuration file from pipeline/config/{university_id}/{domain}.yaml
    Returns the parsed dictionary. Raises FileNotFoundError if missing.
    """
    config_path = Path(__file__).parent.parent / "config" / university_id / f"{domain}.yaml"
    
    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
        
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}
