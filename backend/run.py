# run.py
from app import create_app
from app.extensions import db
from app.seed import seed_data

app = create_app()

@app.cli.command("seed")
def seed():
    """Seed the database with initial data."""
    seed_data()
    print("Database seeded.")

if __name__ == '__main__':
    app.run(debug=True)