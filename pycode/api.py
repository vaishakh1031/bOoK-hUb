from flask import Flask, request, jsonify
from flask_cors import CORS
from book import add_book, search_book, borrow_book, return_book

app = Flask(__name__)
CORS(app)

# Endpoint to add a new book
@app.route('/add_book', methods=['POST'])
def api_add_book():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    isbn = data.get('isbn')
    if not (title and author and isbn):
        return jsonify({"error": "All fields (title, author, isbn) are required."}), 400

    try:
        b_no = add_book(title, author, isbn)
        return jsonify({"message": "Book added successfully.", "book_id": b_no}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to search for books
@app.route('/search_book', methods=['GET'])
def api_search_book():
    query = request.args.get('query', '')
    try:
        results = search_book(query)
        books = [{
            "b_no": row[0],
            "b_title": row[1],
            "b_author": row[2],
            "b_isbn": row[3],
            "borrower": row[4]
        } for row in results]
        return jsonify(books), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to borrow a book
@app.route('/borrow_book', methods=['POST'])
def api_borrow_book():
    data = request.get_json()
    b_no = data.get('b_no')
    borrower = data.get('borrower')
    if not (b_no and borrower):
        return jsonify({"error": "Book ID and borrower name are required."}), 400

    try:
        borrow_book(b_no, borrower)
        return jsonify({"message": "Book borrowed successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to return a book
@app.route('/return_book', methods=['POST'])
def api_return_book():
    data = request.get_json()
    b_no = data.get('b_no')
    if not b_no:
        return jsonify({"error": "Book ID is required."}), 400

    try:
        return_book(b_no)
        return jsonify({"message": "Book returned successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
