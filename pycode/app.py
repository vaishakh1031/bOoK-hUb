from flask import Flask, request, jsonify
from database import load_data, save_data
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)
CORS(app)


@app.route("/add_book", methods=["POST"])
def add_book():
    data = load_data()
    print("Current database data:", data)  # Debugging log

    book = request.json
    print("Book data received from frontend:", book)  # Debugging log

    # Add an ID to the book
    book["id"] = len(data["books"]) + 1
    data["books"].append(book)

    # Save to JSON
    save_data(data)
    print("Updated database data:", data)  # Debugging log

    return jsonify({"message": "Book added successfully!", "book": book})


@app.route("/search_books", methods=["GET"])
def search_books():
    query = request.args.get("query", "").lower()
    data = load_data()
    results = [book for book in data["books"] if query in book["title"].lower() or query in book["author"].lower()]
    return jsonify(results)

@app.route("/borrow_book", methods=["POST"])
def borrow_book():
    data = load_data()
    book_id = request.json.get("id")
    borrower = request.json.get("borrower")
    for book in data["books"]:
        if book["id"] == book_id:
            if "borrower" in book:
                return jsonify({"message": "Book already borrowed!"}), 400
            book["borrower"] = borrower
            save_data(data)
            return jsonify({"message": "Book borrowed successfully!", "book": book})
    return jsonify({"message": "Book not found!"}), 404

@app.route("/return_book", methods=["POST"])
def return_book():
    data = load_data()
    book_id = request.json.get("id")
    for book in data["books"]:
        if book["id"] == book_id:
            if "borrower" not in book:
                return jsonify({"message": "Book is not borrowed!"}), 400
            book.pop("borrower")
            save_data(data)
            return jsonify({"message": "Book returned successfully!", "book": book})
    return jsonify({"message": "Book not found!"}), 404

if __name__ == "_main_":
    app.run(debug=True)
