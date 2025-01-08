from flask import Flask, request, jsonify
from flask_cors import CORS
from database import load_data, save_data

app = Flask(__name__)
CORS(app)

# User Routes
@app.route("/users", methods=["GET"])
def get_users():
    data = load_data()
    return jsonify(data["users"])

@app.route("/add_user", methods=["POST"])
def add_user():
    data = load_data()
    user = request.json
    user["id"] = len(data["users"]) + 1
    user["borrowed_books"] = []
    data["users"].append(user)
    save_data(data)
    return jsonify({"message": "User added successfully!", "user": user})

# Book Routes
@app.route("/books", methods=["GET"])
def get_books():
    data = load_data()
    return jsonify(data["books"])

@app.route("/add_book", methods=["POST"])
def add_book():
    data = load_data()
    book = request.json
    book["id"] = len(data["books"]) + 1
    book["borrower"] = None
    data["books"].append(book)
    save_data(data)
    return jsonify({"message": "Book added successfully!", "book": book})

@app.route("/delete_book", methods=["DELETE"])
def delete_book():
    data = load_data()
    book_id = request.json.get("id")
    data["books"] = [book for book in data["books"] if book["id"] != book_id]
    save_data(data)
    return jsonify({"message": "Book deleted successfully!"})

@app.route("/borrow_book", methods=["POST"])
def borrow_book():
    data = load_data()
    user_id = request.json.get("user_id")
    book_id = request.json.get("book_id")

    # Check if the user exists
    user = next((u for u in data["users"] if u["id"] == user_id), None)
    if not user:
        return jsonify({"message": "User not found!"}), 400

    # Check if the book exists and is not already borrowed
    book = next((b for b in data["books"] if b["id"] == book_id and b["borrower"] is None), None)
    if not book:
        return jsonify({"message": "Book not available or already borrowed!"}), 400

    # Update book and user records
    book["borrower"] = user_id
    user["borrowed_books"].append(book)
    save_data(data)

    return jsonify({"message": "Book borrowed successfully!", "book": book})


@app.route("/return_book", methods=["POST"])
def return_book():
    data = load_data()
    user_id = request.json.get("user_id")
    book_id = request.json.get("book_id")

    for user in data["users"]:
        if user["id"] == user_id:
            user["borrowed_books"] = [
                book for book in user["borrowed_books"] if book["id"] != book_id
            ]
            for book in data["books"]:
                if book["id"] == book_id:
                    book["borrower"] = None
                    save_data(data)
                    return jsonify({"message": "Book returned successfully!"})
    return jsonify({"message": "Return failed!"}), 400

@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Fetch details of a specific user."""
    data = load_data()
    user = next((u for u in data["users"] if u["id"] == user_id), None)
    if not user:
        return jsonify({"message": "User not found!"}), 404
    return jsonify(user)

@app.route("/overdue_books/<int:user_id>", methods=["GET"])
def overdue_books(user_id):
    """Fetch overdue books for a specific user."""
    data = load_data()
    user = next((u for u in data["users"] if u["id"] == user_id), None)
    if not user:
        return jsonify({"message": "User not found!"}), 404

    overdue = [
        book for book in user["borrowed_books"]
        if book.get("due_date") and book["due_date"] < "2024-12-25"  # Replace with dynamic date handling
    ]
    return jsonify(overdue)
@app.route("/user_records", methods=["GET"])
def user_records():
    """Fetch all user records including borrowed books."""
    data = load_data()
    user_records = [
        {
            "name": user["name"],
            "borrowed_books": user["borrowed_books"]
        }
        for user in data["users"]
    ]
    return jsonify(user_records)



if __name__ == "__main__":
    app.run(debug=True)
