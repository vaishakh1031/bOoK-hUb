import json
import os

DB_FILE = "database.json"

def load_data():
    """Load data from the JSON file."""
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({"books": []}, f)
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    """Save data to the JSON file."""
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)
